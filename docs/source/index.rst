.. adminsortable2 documentation master file

======================
django-admin-sortable2
======================

TODO: write!

This Django module is as a replacement for `django-admin-sortable` / `django-admin-sortable2` using an unintrusive approach.

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

...more, mention jrief, ...

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
Copyright © 2015 Alaric Mägerle
Licensed under the MIT license.

Some Related projects
=====================
* https://github.com/jrief/django-admin-sortable2 (django-admin-sort is orginiall based on this)
* https://github.com/iambrandontaylor/django-admin-sortable
* https://github.com/mtigas/django-orderable
* http://djangosnippets.org/snippets/2057/
* http://djangosnippets.org/snippets/2306/
* http://catherinetenajeros.blogspot.co.at/2013/03/sort-using-drag-and-drop.html
