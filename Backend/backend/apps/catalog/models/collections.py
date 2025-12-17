# catalog/models/collections.py
from django.db import models

from apps.core.models import BaseModel
from .products import Product


class Collection(BaseModel):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=180, unique=True, db_index=True)

    class Meta:
        verbose_name = "Collection"
        verbose_name_plural = "Collections"

    def __str__(self) -> str:
        return self.name


class ProductCollection(BaseModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="product_collections",
    )
    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        related_name="collection_products",
    )

    class Meta:
        unique_together = ("product", "collection")

    def __str__(self) -> str:
        return f"{self.product} in {self.collection}"
