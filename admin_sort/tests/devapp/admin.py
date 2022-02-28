from django.contrib import admin

from admin_sort.admin import SortableAdminMixin, SortableInlineAdminMixin

from .models import SortableChild, SortableParent


class SortableChildStacked(SortableInlineAdminMixin, admin.StackedInline):

    model = SortableChild
    position_field = 'position'


class SortableParentAdmin(SortableAdminMixin, admin.ModelAdmin):

    inlines = [SortableChildStacked]
    position_field = 'position'


admin.site.register(SortableParent, SortableParentAdmin)
