#-*- coding: utf-8 -*-
from django.contrib import admin
from admin_sort.admin import SortableAdminMixin, SortableInlineAdminMixin
from . import models


class ChapterInline(SortableInlineAdminMixin, admin.StackedInline):
    model = models.Chapter
    position_field = 'my_order'
    extra = 1


class NotesInline(SortableInlineAdminMixin, admin.TabularInline):
    model = models.Notes
    position_field = 'my_order'
    extra = 2
    fields = ['note', 'another_field', 'one_more', 'my_order']


class ChapterExtraZeroInline(SortableInlineAdminMixin, admin.StackedInline):
    model = models.ChapterExtraZero
    position_field = 'my_order'
    extra = 0


class NotesExtraZeroInline(SortableInlineAdminMixin, admin.TabularInline):
    model = models.NotesExtraZero
    position_field = 'my_order'
    extra = 0
    fields = ['another_field', 'my_order']


class AnotherInline(admin.StackedInline):
    model = models.Another
    extra = 1


class AnotherOneInline(admin.TabularInline):
    model = models.AnotherOne
    extra = 0


@admin.register(models.SortableBook)
class SortableBookAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_per_page = 8
    position_field = 'my_order'
    list_display = ('title', 'my_order',)
    inlines = (
        ChapterInline,
        NotesInline,
        ChapterExtraZeroInline,
        NotesExtraZeroInline,
        AnotherInline,
        AnotherOneInline,
    )


@admin.register(models.Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name',)
