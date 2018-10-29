


class SortableModelMixin(object):

    class Meta:
        position_field = 'position'
        insert_position = 'last'

    def save(self):
        if self.pk:
