# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
from setuptools import setup, find_packages

from admin_sort import __version__


DESCRIPTION = 'Sortable changelist, tabular and stacked inlines, ' \
              'drag-and-drop and dropdowns'

CLASSIFIERS = [
    'Environment :: Web Environment',
    'Framework :: Django',
    'Intended Audience :: Developers',
    'License :: OSI Approved :: MIT License',
    'Operating System :: OS Independent',
    'Programming Language :: Python',
    'Topic :: Software Development :: Libraries :: Python Modules',
    'Development Status :: 4 - Beta',
]


def read(fname):
    # read the contents of a text file
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name='django-admin-sort',
    version=__version__,
    author='Alaric Mägerle',
    author_email='info@rouxcode.ch',
    description=DESCRIPTION,
    long_description=read('PYPI.rst'),
    url='https://github.com/rouxcode/django-admin-sort',
    license='MIT',
    keywords=['django'],
    platforms=['OS Independent'],
    classifiers=CLASSIFIERS,
    install_requires=[],
    packages=find_packages(exclude=['example', 'docs']),
    include_package_data=True,
    zip_safe=False,
)
