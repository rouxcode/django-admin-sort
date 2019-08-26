from admin_sort.utils.model_sorting import (
    set_position_for_new_obj,
    position_object,
)


class SortableModelMixin(object):

    position_field = 'position'
    insert_position = 'last'

    def save(self, *args, **kwargs):
        position = getattr(self, self.position_field, 0)
        if not self.pk:
            set_position_for_new_obj(
                self,
                self.position_field,
                'last',
            )
            if self.insert_position == 'first':
                position = 1
            if position:
                position_object(
                    self,
                    self.position_field,
                    position,
                    commit=False,
                )
        else:
            db_obj = self.__class__.objects.get(pk=self.pk)
            value = getattr(db_obj, self.position_field)
            setattr(self, self.position_field, value)
            position_object(
                self,
                self.position_field,
                position,
                commit=False,
            )
        super(SortableModelMixin, self).save(*args, **kwargs)
