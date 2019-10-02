from __future__ import unicode_literals

from django import forms
from django.conf import settings
from django.contrib import admin
from django.core.exceptions import ImproperlyConfigured
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _


class SortableInlineMixinBase(object):
    # formset = CustomInlineFormSet

    _field = None

    def __init__(self, *args, **kwargs):
        self._field = getattr(self, 'position_field', None)
        if not self._field:
            msg = _('You have to define a position field on {}').format(
                self.__class__.__name__
            )
            raise ImproperlyConfigured(msg)
        if isinstance(self, admin.StackedInline):
            self.is_stacked = True
            self.is_tabular = False
        elif isinstance(self, admin.TabularInline):
            self.is_stacked = False
            self.is_tabular = True
        else:
            msg = (
                'Class {0}.{1} must also derive from'
                ' admin.TabularInline or admin.StackedInline'
            ).format(self.__module__, self.__class__)
            raise ImproperlyConfigured(msg)
        super(SortableInlineMixinBase, self).__init__(*args, **kwargs)

    @property
    def template(self):
        return 'admin/admin_sort/edit_inline/inline.html'

    @property
    def html_data_fields(self):
        data_fields = getattr(
            super(SortableInlineMixinBase, self),
            'html_data_fields',
            ''
        )
        my_data_fields = {
            'admin-sort-position-field': 'field-%s' % self._field
        }
        data_fields_out = ''
        for key, value in my_data_fields.items():
            data_fields_out += ' data-{}="{}"'.format(key, value)
        return mark_safe('{} {}'.format(data_fields, data_fields_out))

    @property
    def css_classes(self):
        css_classes = getattr(
            super(SortableInlineMixinBase, self),
            'css_classes',
            ''
        )
        my_css_classes = 'admin-sort-inline'
        if self.is_tabular:
            my_css_classes += ' admin-sort-tabular'
        else:
            my_css_classes += ' admin-sort-stacked'
        if self.extra > 0:
            my_css_classes += ' has-extra admin-sort-has-extra'
        return '{} {}'.format(css_classes, my_css_classes)


class DragAndDropSortableInlineMixin(SortableInlineMixinBase):

    @property
    def media(self):
        css = {
            'all': ['admin_sort/css/sortable.inline.css'],
        }
        if 'djangocms_admin_style' in settings.INSTALLED_APPS:
            css['all'].append('admin_sort/css/sortable.inline.cms.css')
        js = (
            'admin/js/jquery.init.js',
            'admin_sort/js/sortable.js',
            'admin_sort/js/sortable.draganddrop.inline.js',
        )
        original_media = super(DragAndDropSortableInlineMixin, self).media
        # return original_media
        return original_media + forms.widgets.Media(css=css, js=js)

    @property
    def css_classes(self):
        css_classes = getattr(
            super(DragAndDropSortableInlineMixin, self),
            'css_classes',
            ''
        )
        my_css_classes = 'admin-sort-draganddrop-inline'
        return '{} {}'.format(css_classes, my_css_classes)

    def get_formset(self, request, obj=None, **kwargs):
        formset = super(DragAndDropSortableInlineMixin, self).get_formset(
            request,
            obj,
            **kwargs
        )
        # needed for extra > 0
        formset.form.base_fields[self._field].required = False
        # hide it
        formset.form.base_fields[self._field].widget = forms.HiddenInput(
            attrs={'class': 'admin-sort-position'}
        )
        return formset


class SortableInlineAdminMixin(DragAndDropSortableInlineMixin):
    # deprecated!
    pass


class DropdownSortableInlineMixin(SortableInlineMixinBase):

    @property
    def media(self):
        js = [
            'admin/js/jquery.init.js',
            'admin_sort/js/sortable.dropdown.inline.js',
        ]
        original_media = super(DropdownSortableInlineMixin, self).media
        # return original_media
        return original_media + forms.widgets.Media(js=js)

    @property
    def css_classes(self):
        css_classes = getattr(
            super(DropdownSortableInlineMixin, self),
            'css_classes',
            ''
        )
        my_css_classes = 'admin-sort-dropdown-inline'
        return '{} {}'.format(css_classes, my_css_classes)

    def get_formset(self, request, obj=None, **kwargs):
        formset = super(DropdownSortableInlineMixin, self).get_formset(
            request,
            obj,
            **kwargs
        )
        # needed for extra > 0
        formset.form.base_fields[self._field].required = False
        # prepare widget ARF!
        # import pprint
        # pprint.pprint(self.__dict__)
        # pprint.pprint(self.opts.__dict__)
        # pprint.pprint(formset.__dict__)
        # pprint.pprint(formset.form)
        # TODO: getting count of existing inlines, this is done in js otherwise!
        # count = self.model.objects....count()
        # choices = [(no, no, ) for no in range(1, count)]
        formset.form.base_fields[self._field].widget = forms.Select(
            attrs={'class': 'admin-sort-position'},
            # choices=choices
        )
        return formset
