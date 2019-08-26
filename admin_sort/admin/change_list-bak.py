from __future__ import unicode_literals

from django import forms
from django.conf import settings
from django.conf.urls import url
from django.core.exceptions import ImproperlyConfigured
from django.db import transaction
from django.db.models import F, Max
from django.forms import widgets
from django.http import (
    HttpResponseBadRequest,
    HttpResponseForbidden,
    HttpResponseNotAllowed,
    JsonResponse,
)
from django.urls import reverse
from django.utils.html import mark_safe
from django.utils.translation import ugettext_lazy as _


POSITION_CHOICES = (
    ('', _('Current Position')),
    ('first-child', _('At the top')),
    ('last-child', _('At the Bottom')),
)
MOVE_CHOICES = (
    ('left', _('On top of the target')),
    ('right', _('At the bottom of the target')),
)


class SortableAdminMixin(object):

    """
    _field<required>: which is the positioning field
    _insert_position<default:'last'>: defines where a new object is inserted
        last: at the end of the list
        first: at the start
    """

    _field = None
    _insert_position = None

    change_list_template = 'admin/admin_sort/change_list.html'

    @property
    def media(self):
        css = {
            'all': [
                'admin_sort/css/sortable.css',
            ]
        }
        if 'djangocms_admin_style' in settings.INSTALLED_APPS:
            css['all'].append('admin_sort/css/sortable.cms.css')
        js = [
            'admin_sort/js/sortable.js',
            'admin_sort/js/sortable.list.js',
        ]
        original_media = super(SortableAdminMixin, self).media
        return original_media + widgets.Media(css=css, js=js)

    def __init__(self, model, admin_site):
        self._field = getattr(self, 'position_field', None)
        self._insert_position = getattr(self, 'insert_position', 'last')
        if not self._field:
            msg = _('You have to define a position_field on your {} for SortableAdminMixin to work.').format(
                self.__class__.__name__
            )
            raise ImproperlyConfigured(msg)
        if '-{}'.format(self._field) in model._meta.ordering:
            msg = _(
                '{0} can not be in reverse order (-{0}).'
                'Use {1}.insert_position = first instead'
            ).format(self._field, self.__class__.__name__)
            raise ImproperlyConfigured(msg)
        if self._field not in model._meta.ordering:
            msg = _(
                '{} has to be in MetaClass.ordering of your Model'
            ).format(self._field)
            raise ImproperlyConfigured(msg)
        # Force ordering by position, for this admin!
        self.ordering = [self._field]
        super(SortableAdminMixin, self).__init__(model, admin_site)

    def get_exclude(self, request, obj=None):
        exclude = self.exclude or []
        if self._field not in exclude:
            exclude.append(self._field)
        return exclude

    def get_list_display(self, request):
        list_display = ['_col_move_node'] + [
            d for d in super(SortableAdminMixin, self).get_list_display(
                request
            )
        ]
        # Be sure the position_field is not in list_display
        if self._field in list_display:
            pass  # list_display[self._field]
        return list_display

    def get_list_display_links(self, request, list_display):
        if (self.list_display_links or self.list_display_links is None or not list_display):
            return self.list_display_links
        else:
            # Use only the second item in list_display as link
            # second because first is aur drag handle
            return list(list_display)[1:2]

    def get_queryset(self, request):
        qs = super(SortableAdminMixin, self).get_queryset(request)
        return qs

    def get_urls(self):
        info = [self.model._meta.app_label, self.model._meta.model_name]
        urls = [
            url(
                r'^update/$',
                self.admin_site.admin_view(self.update_view),
                name='{}_{}_update'.format(*info)
            ),
            url(
                r'^reorder/$',
                self.admin_site.admin_view(self.reorder_view),
                name='{}_{}_reorder'.format(*info)
            ),
        ]
        urls += super(SortableAdminMixin, self).get_urls()
        return urls

    def changelist_view(self, request, node_id=None, extra_context=None):
        extra_context = extra_context or {}
        extra_context.update({
            'update_url': self.get_update_url(),
            'reorder_url': self.get_reorder_url(),
        })
        return super(SortableAdminMixin, self).changelist_view(
            request,
            extra_context,
        )

    def save_form(self, request, form, change):
        """
        Given a ModelForm return an unsaved instance. ``change`` is True if
        the object is being changed, and False if it's being added.
        """
        return form.save(commit=False)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            if self._insert_position == 'last':
                pos = self._get_last_position() + 1
            else:
                qs = self.model._default_manager.get_queryset()
                qs.update(**{self._field: F(self._field) + 1})
                pos = 1
            setattr(obj, self._field, pos)
        obj.save()

    def reorder_view(self, request):
        error_response = self.check_ajax_request(request)
        if error_response:
            return error_response
        data = self._reorder_all()
        return JsonResponse(data)

    def update_view(self, request):
        error_response = self.check_ajax_request(request)
        if error_response:
            return error_response
        data = {}
        Form = self.get_update_form_class()
        form = Form(request.POST)
        if form.is_valid():
            data = self._move_obj(
                form.cleaned_data.get('obj'),
                form.cleaned_data.get('target'),
                form.cleaned_data.get('position'),
            )
        else:
            # TODO admin message
            data = {
                'message': 'error',
                'error': _('There seams to be a problem with your list')
            }
        if data.get('message') == 'error':
            # TODO cleanup or provide the user a cleanup choice
            self._reorder_all()
        return JsonResponse(data)

    def check_ajax_request(self, request):
        if not request.is_ajax():
            return HttpResponseBadRequest(
                'Not an XMLHttpRequest'
            )
        if request.method != 'POST':
            return HttpResponseNotAllowed(
                'Must be a POST request'
            )
        if not self.has_change_permission(request):
            return HttpResponseForbidden(
                'Missing permissions to perform this request'
            )
        return None

    def get_update_form_class(self):
        class UpdateForm(forms.Form):
            position = forms.ChoiceField(
                choices=MOVE_CHOICES
            )
            obj = forms.ModelChoiceField(
                queryset=self.model._default_manager.get_queryset()
            )
            target = forms.ModelChoiceField(
                queryset=self.model._default_manager.get_queryset()
            )
        return UpdateForm

    def get_reorder_url(self):
        info = [self.model._meta.app_label, self.model._meta.model_name]
        return reverse(
            'admin:{}_{}_reorder'.format(*info),
            current_app=self.admin_site.name
        )

    def get_update_url(self):
        info = [self.model._meta.app_label, self.model._meta.model_name]
        return reverse(
            'admin:{}_{}_update'.format(*info),
            current_app=self.admin_site.name
        )

    def _get_last_position(self):
        objects = self.model._default_manager.get_queryset()
        result = objects.aggregate(last_position=Max(self._field))
        return result['last_position'] or 0

    def _move_obj(self, obj, target, position):
        base_qs = self.model._default_manager.get_queryset()
        obj_start = getattr(obj, self._field, None)
        target_start = getattr(target, self._field, None)

        # EDGE Cases
        if obj_start == target_start:
            # TODO this is an ugly hack try to find a better way
            self._reorder_all()
            obj = base_qs.get(pk=obj.pk)
            target = base_qs.get(pk=target.pk)
            obj_start = getattr(obj, self._field, None)
            target_start = getattr(target, self._field, None)
            direction = 'down'
            start, end = obj_start, target_start

        # set Direction
        if obj_start < target_start:
            direction = 'down'
            start, end = obj_start, target_start
        if obj_start > target_start:
            direction = 'up'
            start, end = target_start, obj_start

        # set the range for the objects
        kwargs = {'%s__gte' % self._field: start, '%s__lte' % self._field: end}

        # build queryset kwargs
        if direction == 'down':
            if position == 'left':
                # Nasty exception this should not happen
                # TODO find a better way to deal with this
                exclude = [obj.pk]
                # bulk move up by one
                update_kwargs = {self._field: F(self._field)}
                # set the obj position to the targets position
                obj_position = getattr(obj, self._field)
            elif position == 'right':
                # remove the obj from bulk move
                exclude = [obj.pk]
                # bulk move up by one
                update_kwargs = {self._field: F(self._field) - 1}
                # set the obj position to the targets position
                obj_position = getattr(target, self._field)
            # remove the selected obj from the bulk move
            qs = base_qs.filter(**kwargs).exclude(pk__in=exclude)
        elif direction == 'up':
            if position == 'right':
                # remove the obj and the target from bulk move as the target
                # does not need to be moved
                exclude = [obj.pk, target.pk]
                # set the obj position to 1 greater than the targets position
                obj_position = getattr(target, self._field) + 1
            elif position == 'left':
                # remove the obj from bulk move
                exclude = [obj.pk]
                # set the obj position to the targets position
                obj_position = getattr(target, self._field)
            # remove the exclude from bulk move
            qs = base_qs.filter(**kwargs).exclude(pk__in=exclude)
            # bulk move down by one
            update_kwargs = {self._field: F(self._field) + 1}
        with transaction.atomic():
            setattr(obj, self._field, obj_position)
            obj.save()
            qs.update(**update_kwargs)
        return_data = {
            'message': 'ok',
            'dir': direction,
            'pos': position,
            'start': start,
            'end': end,
            'object_list': [
                o for o in base_qs.filter(**kwargs).values('pk', self._field)
            ]
        }
        return return_data

    def _reorder_all(self):
        # TODO implement
        object_list = []
        with transaction.atomic():
            pos = 1
            for o in self.model._default_manager.get_queryset():
                setattr(o, self._field, pos)
                o.save()
                object_list.append([pos, o.pk, '{}'.format(o)])
                pos += 1
        return {
            'message': 'ok',
            'objects': object_list,
        }

    # CHANGE LIST AUXILIARY COLUMNS
    def _col_move_node(self, obj):
        data_attrs = [
            'data-pk="{}"'.format(obj.pk),
            'data-name="{}"'.format(obj),
        ]
        html = '<span class="admin-sort-drag" {}></span>'.format(
            ' '.join(data_attrs)
        )
        return mark_safe(html)
    _col_move_node.short_description = ''
