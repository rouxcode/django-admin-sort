from django import forms
from django.contrib import admin
from django.core.exceptions import ImproperlyConfigured
from django.utils.safestring import mark_safe


class SortableInlineMixinBase(object):
    # formset = CustomInlineFormSet

    _field = None
    template = 'admin/admin_sort/edit_inline/inline.html'

    def __init__(self, *args, **kwargs):
        self._field = getattr(self, 'position_field', None)
        if not self._field:
            msg = ('You have to define a position field on {}').format(
                self.__class__.__name__
            )
            raise ImproperlyConfigured(msg)
        if isinstance(self, admin.StackedInline):
            self.inline_type = 'stacked'
        elif isinstance(self, admin.TabularInline):
            self.inline_type = 'tabular'
        else:
            msg = (
                'Class {}.{} must also derive from '
                'admin.TabularInline or admin.StackedInline'
            ).format(self.__module__, self.__class__)
            raise ImproperlyConfigured(msg)
        super().__init__(*args, **kwargs)

    @property
    def html_data_fields(self):
        data_fields = getattr(super(), 'html_data_fields', '').split(' ')
        data_fields.append(
            'data-admin-sort-type="{}"'.format(self.inline_type)
        )
        return mark_safe(' '.join(data_fields))

    @property
    def css_classes(self):
        css_classes = getattr(super(), 'css_classes', '').split(' ')
        css_classes.append('admin-sort-inline')
        css_classes.append('admin-sort-{}'.format(self.inline_type))

        if self.extra > 0:
            css_classes.append('admin-sort-has-extra')
        return ' '.join(css_classes)


class DragAndDropSortableInlineMixin(SortableInlineMixinBase):

    @property
    def media(self):
        css = {'all': ['admin_sort/sort.css']}
        js = ['admin_sort/sort.js']
        return super().media + forms.widgets.Media(css=css, js=js)

    @property
    def css_classes(self):
        css_classes = getattr(super(), 'css_classes', '')
        css_classes += ' admin-sort-inline-drag'
        return '{}'.format(css_classes)

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        # needed for django.InlineAdmin.extra > 0
        formset.form.base_fields[self._field].required = False
        # hide the position field
        formset.form.base_fields[self._field].widget = forms.HiddenInput(
            attrs={'class': 'admin-sort-position'}
        )
        return formset


class SortableInlineAdminMixin(DragAndDropSortableInlineMixin):
    # deprecated! or make a deattr decision perhaps ?
    pass


class DropdownSortableInlineMixin(SortableInlineMixinBase):

    @property
    def css_classes(self):
        css_classes = getattr(super(), 'css_classes', '').split(' ')
        css_classes.append(' admin-sort-inline-dropdown')
        return ' '.join(css_classes)

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        # needed for extra > 0
        formset.form.base_fields[self._field].required = False
        # prepare widget ARF!
        # TODO: getting count of existing inlines, this is done in js otherwise
        # count = self.model.objects....count()
        # choices = [(no, no, ) for no in range(1, count)]
        formset.form.base_fields[self._field].widget = forms.Select(
            attrs={'class': 'admin-sort-position'},
            # choices=choices
        )
        return formset
