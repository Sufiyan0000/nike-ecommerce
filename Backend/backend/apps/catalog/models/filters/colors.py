# catalog/models/filters/colors.py
from django.db import models
from apps.core.models import BaseModel


class Color(BaseModel):
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50, unique=True, db_index=True)
    hex_code = models.CharField(max_length=7)  # e.g. "#FF0000"

    class Meta:
        verbose_name = "Color"
        verbose_name_plural = "Colors"

    def __str__(self) -> str:
        return self.name
