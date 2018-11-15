# django-admin-sort

[![Django Admin Sort Build Status](https://travis-ci.org/rouxcode/django-admin-sort.svg "Django Admin Sort Build Status")](https://travis-ci.org/rouxcode/django-admin-sort)

Sortable changelist, tabular and stacked inlines. Using existing order fields, flexible.

Originally based on [jrief's django-admin-sortable2](https://github.com/jrief/django-admin-sortable2),
django-admin-sort tries to further simplify, but also add some minor new features (like dropdown sortables, someday).

django-admin-sort's focus is on admin sorting, as the name suggests. Nevertheless, it provides a very simple 
`SortableModelMixin` class, that can be used to add sorting on your models, without the admin.

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
class from a special base model class. But if you want (or if you dont need the admin), you can
use the `admin_sort.models.SortableModelMixin`, a convinience mixin to make your model sortable.


### Integrate your models

Each database model which shall be sortable, requires a position value in its model description.

	class SortableBook(models.Model):
	    title = models.CharField('Title', null=True, blank=True, max_length=255)
	    my_order = models.PositiveIntegerField(default=0, blank=False, null=False)

	    class Meta(object):
	        ordering = ('my_order', 'title', )

Here the ordering field is named ``my_order``, but you may choose any other name. One constraint:

* ``my_order``'s default value must be 0. The JavaScript which performs the sorting is 1-indexed,
	so this will not interfere with the order of your items, even if you're already using 0-indexed
	ordering fields.

The field used to store the ordering position may be any kind of numeric model field offered by
Django. Use one of these models fields:

* ``models.PositiveIntegerField``
* ``models.PositiveSmallIntegerField`` (recommended for small sets)

**WARNING:** Do not make this field unique!


### Sortable list view

In ``admin.py``, add a mixin class to augment the functionality for sorting (be sure to put the
mixin class before model.ModelAdmin):

	from django.contrib import admin
	from admin_sort.admin import SortableAdminMixin
	from models import MyModel

	class MyModelAdmin(SortableAdminMixin, admin.ModelAdmin):
	    position_field = 'my_order'  # required
	    insert_position = 'first|last'  # optional, last is default
	    
	admin.site.register(MyModel, MyModelAdmin)

The list view of the model admin interface now adds a column with a sensitive area.
By clicking on that area, the user can move that row up or down.


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

django-admin-sort adds a "reorder" button in the admin change list (just next to "add new"), for superadmins only.
Hit it, and the position_field will be repopulated, ensuring data integrity.
 

## License

Copyright © 2018 Alaric Mägerle & Ben Stähli
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


### geckodriver install

- visit https://github.com/mozilla/geckodriver/releases
- download the latest version of "geckodriver-vX.XX.X-linux64.tar.gz"
- unarchive the tarball (tar -xvzf geckodriver-vX.XX.X-linux64.tar.gz)
- give executable permissions to geckodriver (chmod +x geckodriver)
- move the geckodriver binary to /usr/local/bin or any location on your system PATH.
