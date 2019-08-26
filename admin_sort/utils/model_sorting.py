from __future__ import unicode_literals

from django.db import transaction
from django.db.models import F


def set_position_for_new_obj(obj, position_field, insert_position='last'):
    """
    set a new instance's position field, update other objects if needed
    :param obj:
    :param insert_position:
    :return obj: instance, with position field set, not saved
    """
    if insert_position == 'last':
        pos = get_last_position(obj.__class__, position_field) + 1
    else:
        qs = obj.__class__._default_manager.get_queryset()
        qs.update(**{position_field: F(position_field) + 1})
        pos = 1
    setattr(obj, position_field, pos)
    return obj


def get_last_position(model_cls, position_field):
    objects = model_cls._default_manager.get_queryset()
    # result = objects.aggregate(last_position=Max(position_field))
    # return result['last_position'] or 0
    return objects.all().count()


def reorder_all(model_cls, position_field):
    with transaction.atomic():
        pos = 1
        for o in model_cls._default_manager.get_queryset():
            setattr(o, position_field, pos)
            o.save()
            pos += 1


def position_object(obj, position_field, new_position, commit=True):
    """
    set a new position for an object
    :param obj:
    :param position_field:
    :param new_position:
    :return obj:
    """
    # calculate, return, cleanup if necessary
    obj_start_position = getattr(obj, position_field, None)
    if new_position == obj_start_position:
        return obj
    base_qs = obj.__class__._default_manager.get_queryset()
    last_position = get_last_position(obj.__class__, position_field)
    if new_position > last_position:
        new_position = last_position
    if new_position == 0:
        new_position = 1
    # the actual work
    if new_position > obj_start_position:
        # down/right in the list, bigger position value than before
        update_kwargs = {position_field: F(position_field) - 1}
        update_start_position = obj_start_position
        update_end_position = new_position
    else:
        # up/left in the list
        update_kwargs = {position_field: F(position_field) + 1}
        update_start_position = new_position
        update_end_position = obj_start_position
    update_qs_filter_kwargs = {
        '%s__gte' % position_field: update_start_position,
        '%s__lte' % position_field: update_end_position
    }
    update_qs = base_qs.filter(**update_qs_filter_kwargs)
    update_qs = update_qs.exclude(pk=obj.pk)
    with transaction.atomic():
        update_qs.update(**update_kwargs)
        setattr(obj, position_field, new_position)
        if commit:
            obj.save()
    return obj
