.. _installation:

============
Installation
============

Install **django-admin-sort**. The latest stable release can be found on PyPI (not found)

.. code-block:: bash

	pip install django-admin-sort

or the newest development version from GitHub

.. code-block:: bash

	pip install -e git+https://github.com/rouxcode/django-admin-sort@develop#egg=django-admin-sort

Configuration
=============

Add ``'admin_sort'`` to the list of ``INSTALLED_APPS`` in your project's ``settings.py`` file

.. code-block:: python

	INSTALLED_APPS = (
	    ...
	    'admin_sort',
	    ...
	)
