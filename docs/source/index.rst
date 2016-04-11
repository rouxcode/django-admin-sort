.. admin_sort documentation master file

======================
django-admin-sort
======================

TODO: write!

This Django module is as a replacement for `django-admin-sortable` / `django-admin-sortable2`, using
almost the same approach as django-admin-sortable2.

It is a generic drag-and-drop/dropdown ordering module for sorting objects in the list view of the Django
admin interface. This plugin offers simple mixin classes which enrich the functionality of *any*
existing class derived from ``admin.ModelAdmin``, ``admin.StackedInline`` or
``admin.TabluarInline``. It thus makes it very easy to integrate with existing models and their
model admin interfaces.

Project home: https://github.com/rouxcode/django-admin-sort

Please ask questions and report bugs on: https://github.com/rouxcode/django-admin-sort/issues

Why yet another adminsortable plugin?
=================================

All available plugins which add functionality to make list views for the Django admin interface
sortable, offer a base class to be used instead of ``models.Model``. This abstract base class then
contains a hard coded position field, additional methods, and meta directives.
django-admin-sortable2 solved this issue, using a Mixin approach. django-admin-sort adds a more
robust test suite, and some things, as ordering with a select/dropdown (planned for 1.0).



Contents:
=========
.. toctree::

  installation
  usage
  demos
  changelog

Indices and tables
------------------
* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

License
=======
Copyright © 2015 Alaric Mägerle & Ben Stähli
Licensed under the MIT license.

Some Related projects
=====================
* https://github.com/jrief/django-admin-sortable2 (django-admin-sort is orginiall based on this)
* https://github.com/iambrandontaylor/django-admin-sortable
* https://github.com/mtigas/django-orderable
* http://djangosnippets.org/snippets/2057/
* http://djangosnippets.org/snippets/2306/
* http://catherinetenajeros.blogspot.co.at/2013/03/sort-using-drag-and-drop.html
