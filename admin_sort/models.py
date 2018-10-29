from admin_sort.utils.model_sorting import set_position_for_new_obj, position_object


class SortableModelMixin(object):

    class Meta:
        position_field = 'position'
        insert_position = 'last'

    def save(self, *args, **kwargs):
        position = getattr(self, self._meta.position_field, 0)
        if not self.pk:
            set_position_for_new_obj(
                self,
                self._meta.position_field,
                'last',
            )
            if self._meta.insert_position == 'first':
                position = 1
            if position:
                position_object(
                    self,
                    self._meta.position_field,
                    position,
                    commit=False,
                )
        else:
            position_object(
                self,
                self._meta.position_field,
                position,
                commit=False,
            )
        super(SortableModelMixin, self).save(*args, **kwargs)

