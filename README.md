# django-admin-sort

[![Django Admin Sort Build Status](https://travis-ci.org/rouxcode/django-admin-sort.svg "Django Admin Sort Build Status")](https://travis-ci.org/rouxcode/django-admin-sort)

Sortable changelist, tabular and stacked inlines. Using existing order fields, flexible.

Originally based on [jrief's django-admin-sortable2](https://github.com/jrief/django-admin-sortable2),
django-admin-sort tries to further simplify, but also add some minor new features (like dropdown sortables, someday).

## Installation

The latest stable release can be found on PyPI.

	pip install django-admin-sort

Add ``'admin_sort'`` to the list of ``INSTALLED_APPS`` in your project's ``settings.py`` file.

	INSTALLED_APPS = (
	    ..,
	    'admin_sort',
	)


## Using Admin Sort

This Django module offers two mixin classes to be added to the existing classes of your model
admin:

* ``admin_sort.admin.SortableAdminMixin``
* ``admin_sort.admin.SortableInlineAdminMixin``

They slightly modify the admin views of a sortable model. There is no need to derive your model
class from a special base model class.


### Integrate your models

Each database model which shall be sortable, requires a position value in its model description. The only requirement
for this module is, that the position value be specified as the primary field used for sorting.

	class SortableBook(models.Model):
	    title = models.CharField('Title', null=True, blank=True, max_length=255)
	    my_order = models.PositiveIntegerField(default=0, blank=False, null=False)

	    class Meta(object):
	        ordering = ('my_order', 'title', )

Here the ordering field is named ``my_order``, but you may choose any other name. There are only
two constraints:

* ``my_order`` is the first field in the ``ordering`` tuple of the model's Meta class.
* ``my_order``'s default value must be 0. The JavaScript which performs the sorting is 1-indexed,
	so this will not interfere with the order of your items, even if you're already using 0-indexed
	ordering fields.

The field used to store the ordering position may be any kind of numeric model field offered by
Django. Use one of these models fields:

* ``models.BigIntegerField``
* ``models.IntegerField``
* ``models.PositiveIntegerField`` (recommended)
* ``models.PositiveSmallIntegerField`` (recommended for small sets)
* ``models.SmallIntegerField``

Additionally you may use ``models.DecimalField`` or ``models.FloatField``, but these model fields
are not recommended.

**WARNING:** Do not make this field unique! See below why.


### Sortable list view

In ``admin.py``, add a mixin class to augment the functionality for sorting (be sure to put the
mixin class before model.ModelAdmin):

	from django.contrib import admin
	from admin_sort.admin import SortableAdminMixin
	from models import MyModel

	class MyModelAdmin(SortableAdminMixin, admin.ModelAdmin):
	    pass
	admin.site.register(MyModel, MyModelAdmin)

The list view of the model admin interface now adds a column with a sensitive area.
By clicking on that area, the user can move that row up or down. If he wants to move it to another
page, he can do that as a bulk operation, using the admin actions.


### Sortable stacked or tabular inline

	from django.contrib import admin
	from admin_sort.admin import SortableInlineAdminMixin
	from models import MySubModel, MyModel

	class MySubModelInline(SortableInlineAdminMixin, admin.TabularInline):  # or admin.StackedInline
	    model = MySubModel

	class MyModelAdmin(admin.ModelAdmin):
	    inlines = (MySubModelInline,)
	admin.site.register(MyModel, MyModelAdmin)

The interface for a sortable stacked inline view is similar. If you click on an stacked
inline's field title, this whole inline form can be moved up and down.

The interface for a sortable tabular inline view adds a sensitive area to each draggable row. These
rows then can be moved up and down.

After moving a tabular or stacked inline, save the model form to persist
its sorting order.


### Initial data

In case you just changed your model to contain an additional sorting
field (e.g. ``my_order``), which does not yet contain any values, then
you must set initial ordering values.

django-admin-sort is shipping with a management command which can be used to prepopulate
the ordering field:

	shell> ./manage.py reorder my_app.models.MyModel

If you prefer to do a one-time database migration, just after having added the ordering field
to the model, then create a datamigration, more advanced fiddling is possible there.

**NOTE:** If you omit to prepopulate the ordering field with unique values, after adding this field
          to an existing model, then attempting to reorder field manually will fail.


### Note on unique indices on the position field

From a design consideration, one might be tempted to add a unique index on the ordering field. But
in practice this has serious drawbacks:

MySQL has a feature (or bug?) which requires to use the ``ORDER BY`` clause in bulk updates on
unique fields.

SQLite has the same bug which is even worse, because it does neither update all the fields in one
transaction, nor does it allow to use the ``ORDER BY`` clause in bulk updates.

Only PostgreSQL does it "right" in the sense, that it updates all fields in one transaction and
afterwards rebuilds the unique index. Here one can not use the ``ORDER BY`` clause during updates,
which from the point of view for SQL semantics, is senseless anyway.

See https://code.djangoproject.com/ticket/20708 for details.

Therefore we strongly advise against setting ``unique=True`` on the position field, unless you want
unportable code, which only works with Postgres databases.


## License

Copyright © 2015 Alaric Mägerle & Ben Stähli
Licensed under the MIT license.


## Run Example Code

To get a quick first impression of this plugin, clone this repositoty
from GitHub and run an example webserver:

.. code:: bash

	git clone https://github.com/rouxcode/django-admin-sort.git
	cd django-admin-sort/example/
	./manage.py syncdb
	./manage.py createsuperuser
	./manage.py loaddata testapp/fixtures/data.json
	./manage.py runserver

Point a browser onto http://localhost:8000/admin/, log in and go to *Sortable books*. There you can
test the behavior of this Django app.
