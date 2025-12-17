# carts/models.py
from django.conf import settings
from django.db import models

from apps.core.models import BaseModel


class Cart(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="carts",
    )
    guest_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        db_index=True,
        help_text="Anonymous identifier (cookie/UUID) for guests.",
    )

    class Meta:
        indexes = [
            models.Index(fields=["guest_id"]),
            models.Index(fields=["user"]),
        ]

    def __str__(self) -> str:
        who = self.user or self.guest_id or "anonymous"
        return f"Cart({who})"


class CartItem(BaseModel):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )
    product_variant = models.ForeignKey(
        "catalog.ProductVariant",
        on_delete=models.PROTECT,
        related_name="cart_items",
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "product_variant")

    def __str__(self) -> str:
        return f"{self.product_variant} x {self.quantity}"
