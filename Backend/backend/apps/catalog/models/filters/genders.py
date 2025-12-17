# catalog/models/filters/genders.py
from django.db import models
from apps.core.models import BaseModel


class Gender(BaseModel):
    label = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50, unique=True, db_index=True)

    class Meta:
        verbose_name = "Gender"
        verbose_name_plural = "Genders"

    def __str__(self) -> str:
        return self.label
