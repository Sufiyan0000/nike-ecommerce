# apps/accounts/models/addresses.py

from django.conf import settings
from django.db import models

from apps.core.models import BaseModel  # your abstract base (uuid + created_at, updated_at)


class Address(BaseModel):
    class AddressType(models.TextChoices):
        BILLING = "billing", "Billing"
        SHIPPING = "shipping", "Shipping"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="account_addresses",
    )
    type = models.CharField(
        max_length=20,
        choices=AddressType.choices,
    )
    line1 = models.CharField(max_length=255)
    line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)

    class Meta:
        db_table = "addresses"
        ordering = ["-is_default", "id"]
        indexes = [
            models.Index(fields=["user", "type"]),
        ]

    def __str__(self):
        return f"{self.user} - {self.type} - {self.line1}, {self.city}"
