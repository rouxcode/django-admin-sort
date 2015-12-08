# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
from setuptools import setup, find_packages
from adminsortable2 import __version__
try:
    from pypandoc import convert
except ImportError:
    def convert(filename, fmt):
        with open(filename) as fd:
            return fd.read()

DESCRIPTION = 'Generic sorting for the List, the Stacked- and the Tabular-Inlines Views in the Django Admin'

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


setup(
    name='django-admin-sort',
    version=__version__,
    author='Alaric Mägerle',
    author_email='info@rouxcode.ch',
    description=DESCRIPTION,
    long_description=convert('README.md', 'rst'),
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
