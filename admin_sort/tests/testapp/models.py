# -*- coding: utf-8 -*-
from django.db import models

from admin_sort.models import SortableModelMixin


class Author(SortableModelMixin, models.Model):
    """
    SortableModelMixin: on save, intercept and first update needed other instances, then save
    """
    name = models.CharField('Name', null=True, blank=True, max_length=255)
    my_order = models.PositiveIntegerField(default=0, blank=False, null=False)
    position_field = 'my_order'
    insert_position = 'last'

    class Meta:
        ordering = ('my_order', )

    def __unicode__(self):
        return self.name


class SortableBook(models.Model):
    """
    the classic sortable change list: dndrop sorting, using SortableAdminMixin
    """
    title = models.CharField('Title', null=True, blank=True, max_length=255)
    my_order = models.PositiveIntegerField(default=0, blank=False, null=False)
    author = models.ForeignKey(Author, null=True, on_delete=models.SET_NULL)

    class Meta(object):
        ordering = ('my_order',)

    def __unicode__(self):
        return self.title


class AnotherSortableBook(models.Model):
    """
    the other sortable change list: dropdowns sorting, using DropdownSortableAdminMixin
    """
    title = models.CharField('Title', null=True, blank=True, max_length=255)
    my_order = models.PositiveIntegerField(default=0, blank=False, null=False)
    author = models.ForeignKey(Author, null=True, on_delete=models.SET_NULL)

    class Meta(object):
        ordering = ('my_order',)

    def __unicode__(self):
        return self.title


class Chapter(models.Model):
    """
    various SortableInlineMixon modes
    """
    title = models.CharField('Title', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True, on_delete=models.SET_NULL)
    another_book = models.ForeignKey(AnotherSortableBook, null=True, on_delete=models.SET_NULL)
    my_order = models.PositiveIntegerField(blank=False, null=True)
    another_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order', 'another_order', )

    def __unicode__(self):
        return 'Chapter: {0}'.format(self.title)


class Notes(models.Model):
    """
    various SortableInlineMixon modes
    """
    book = models.ForeignKey(SortableBook, null=True, on_delete=models.SET_NULL)
    another_book = models.ForeignKey(AnotherSortableBook, null=True, on_delete=models.SET_NULL)
    note = models.CharField('Note', null=True, blank=True, max_length=255)
    another_field = models.CharField('Note2', null=True, blank=True, max_length=255)
    one_more = models.CharField('Note3 (simulating tabular inlines)', null=True, blank=True, max_length=255)
    my_order = models.PositiveIntegerField(blank=False, null=True)
    another_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order', 'another_order', )

    def __unicode__(self):
        return 'Note: {0}'.format(self.note)


class ChapterExtraZero(models.Model):
    """
    various SortableInlineMixon modes (testing "extra" on admin.Meta)
    """
    title = models.CharField('Title', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True, on_delete=models.SET_NULL)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order', '-title')

    def __unicode__(self):
        return 'ChapterExtraZero: {0}'.format(self.title)


class NotesExtraZero(models.Model):
    """
    various SortableInlineMixon modes (testing "extra" on admin.Meta)
    """
    another_field = models.CharField('Note2', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True, on_delete=models.SET_NULL)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order', 'another_field')

    def __unicode__(self):
        return 'NotesExtraZero: {0}'.format(self.another_field)


class Another(models.Model):
    """
    normal inline - affected in any way!?
    """
    title = models.CharField('Title', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True, on_delete=models.SET_NULL)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order', '-title')

    def __unicode__(self):
        return 'Another: {0}'.format(self.title)


class AnotherOne(models.Model):
    """
    normal inline - affected in any way!?
    """
    another_field = models.CharField('Note2', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True, on_delete=models.SET_NULL)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    def __unicode__(self):
        return 'AnotherOne: {0}'.format(self.another_field)
