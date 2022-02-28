from django.db import models


class SortableAbstract(models.Model):

    position = models.PositiveIntegerField(
        default=0
    )
    name = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )

    class Meta:
        abstract = True

    def __str__(self):
        if not self.name:
            return 'Sortable {}'.format(self.pk)
        return '{}'.format(self.name)


class SortableParent(SortableAbstract):

    class Meta:
        abstract = False
        ordering = ['position']


class SortableChild(SortableAbstract):

    parent = models.ForeignKey(
        SortableParent,
        on_delete=models.CASCADE,
    )

    class Meta:
        abstract = False
        ordering = ['position']
