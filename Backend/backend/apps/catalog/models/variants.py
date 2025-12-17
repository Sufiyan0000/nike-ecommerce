# catalog/models/variants.py
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models

from apps.core.models import BaseModel
from .products import Product
from .filters import Color, Size


class ProductVariant(BaseModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants",
    )
    sku = models.CharField(max_length=50, unique=True, db_index=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    color = models.ForeignKey(
        Color,
        on_delete=models.PROTECT,
        related_name="variants",
    )
    size = models.ForeignKey(
        Size,
        on_delete=models.PROTECT,
        related_name="variants",
    )
    in_stock = models.IntegerField(default=0)
    weight = models.FloatField(default=0.0)
    dimensions = models.JSONField(
        default=dict,  # { "length": ..., "width": ..., "height": ... }
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(fields=["product"]),
            models.Index(fields=["sku"]),
        ]

    def __str__(self) -> str:
        return f"{self.product.name} | {self.sku}"

    def clean(self) -> None:
        super().clean()
        if self.sale_price is not None and self.sale_price > self.price:
            raise ValidationError(
                {"sale_price": "Sale price cannot be greater than regular price."}
            )
        if self.price < Decimal("0.00"):
            raise ValidationError({"price": "Price must be non-negative."})
