from __future__ import unicode_literals

from django import forms
from django.conf import settings
from django.contrib import admin
from django.core.exceptions import ImproperlyConfigured
from django.utils.translation import ugettext_lazy as _


class SortableInlineAdminMixin(object):
    # formset = CustomInlineFormSet

    _field = None

    def __init__(self, *args, **kwargs):
        self._field = getattr(self, 'position_field', None)
        if not self._field:
            msg = _('You have to define a position field on {}').format(
                self.__class__.__name__
            )
            raise ImproperlyConfigured(msg)
        super(SortableInlineAdminMixin, self).__init__(*args, **kwargs)

    @property
    def media(self):
        css = {
            'all': ['admin_sort/css/sortable.inline.css'],
        }
        if 'djangocms_admin_style' in settings.INSTALLED_APPS:
            css['all'].append('admin_sort/css/sortable.inline.cms.css')
        js = (
            'admin_sort/js/sortable.js',
            'admin_sort/js/sortable.inline.js',
        )
        original_media = super(SortableInlineAdminMixin, self).media
        return original_media + forms.widgets.Media(css=css, js=js)

    @property
    def template(self):
        if isinstance(self, admin.StackedInline):
            return 'admin/admin_sort/edit_inline/stacked.html'
        if isinstance(self, admin.TabularInline):
            return 'admin/admin_sort/edit_inline/tabular.html'
        msg = (
            'Class {0}.{1} must also derive from'
            ' admin.TabularInline or admin.StackedInline'
        ).format(self.__module__, self.__class__)
        raise ImproperlyConfigured(msg)

    def get_formset(self, request, obj=None, **kwargs):
        formset = super(SortableInlineAdminMixin, self).get_formset(
            request,
            obj,
            **kwargs
        )
        formset.form.base_fields[self._field].widget = forms.HiddenInput(
            attrs={'class': 'admin-sort-position'}
        )
        return formset
