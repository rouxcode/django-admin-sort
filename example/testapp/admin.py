#-*- coding: utf-8 -*-
from django.contrib import admin
from admin_sort.admin import SortableAdminMixin, SortableInlineAdminMixin
from . import models


class ChapterInline(SortableInlineAdminMixin, admin.StackedInline):
    model = models.Chapter
    extra = 1


class NotesInline(SortableInlineAdminMixin, admin.TabularInline):
    model = models.Notes
    extra = 1

class SortableBookAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_per_page = 8
    list_display = ('title', 'my_order',)
    inlines = (ChapterInline, NotesInline,)
admin.site.register(models.SortableBook, SortableBookAdmin)


class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name',)
admin.site.register(models.Author, AuthorAdmin)
