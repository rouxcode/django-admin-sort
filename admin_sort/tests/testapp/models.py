# -*- coding: utf-8 -*-
from django.db import models


class Author(models.Model):
    name = models.CharField('Name', null=True, blank=True, max_length=255)

    def __unicode__(self):
        return self.name


class SortableBook(models.Model):
    title = models.CharField('Title', null=True, blank=True, max_length=255)
    my_order = models.PositiveIntegerField(default=0, blank=False, null=False)
    author = models.ForeignKey(Author, null=True)

    class Meta(object):
        ordering = ('my_order',)

    def __unicode__(self):
        return self.title


class Chapter(models.Model):
    title = models.CharField('Title', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order',)

    def __unicode__(self):
        return 'Chapter: {0}'.format(self.title)


class Notes(models.Model):
    note = models.CharField('Note', null=True, blank=True, max_length=255)
    another_field = models.CharField('Note2', null=True, blank=True, max_length=255)
    one_more = models.CharField('Note3 (simulating tabular inlines)', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order',)

    def __unicode__(self):
        return 'Note: {0}'.format(self.note)


class ChapterExtraZero(models.Model):
    title = models.CharField('Title', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order', '-title')

    def __unicode__(self):
        return 'ChapterExtraZero: {0}'.format(self.title)


class NotesExtraZero(models.Model):
    another_field = models.CharField('Note2', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order', 'another_field')

    def __unicode__(self):
        return 'NotesExtraZero: {0}'.format(self.another_field)


class Another(models.Model):
    title = models.CharField('Title', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    class Meta(object):
        ordering = ('my_order', '-title')

    def __unicode__(self):
        return 'Another: {0}'.format(self.title)


class AnotherOne(models.Model):
    another_field = models.CharField('Note2', null=True, blank=True, max_length=255)
    book = models.ForeignKey(SortableBook, null=True)
    my_order = models.PositiveIntegerField(blank=False, null=True)

    def __unicode__(self):
        return 'AnotherOne: {0}'.format(self.another_field)