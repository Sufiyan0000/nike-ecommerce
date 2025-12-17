# catalog/models/filters/sizes.py
from django.db import models
from apps.core.models import BaseModel


class Size(BaseModel):
    name = models.CharField(max_length=50)  # "M"
    slug = models.SlugField(max_length=50, unique=True, db_index=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Size"
        verbose_name_plural = "Sizes"
        ordering = ["sort_order"]

    def __str__(self) -> str:
        return self.name
