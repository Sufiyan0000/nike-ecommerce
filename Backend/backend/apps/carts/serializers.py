# apps/carts/serializers.py

from rest_framework import serializers

from .models import Cart, CartItem
from apps.catalog.models.variants import ProductVariant
from apps.catalog.serializers import ProductVariantSerializer


class CartItemSerializer(serializers.ModelSerializer):
    # For writing: send variant id
    product_variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all()
    )
    # For reading: nested details
    product_variant_detail = ProductVariantSerializer(
        source="product_variant", read_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "cart",
            "product_variant",
            "product_variant_detail",
            "quantity",
        ]
        read_only_fields = ["id", "cart", "product_variant_detail"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    # Optional: total price (requires access to variant price)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "user",
            "guest",
            "created_at",
            "updated_at",
            "items",
            "total_items",
            "total_amount",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "items", "total_items", "total_amount"]

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_total_amount(self, obj):
        total = 0
        for item in obj.items.select_related("product_variant"):
            variant = item.product_variant
            price = variant.sale_price or variant.price
            if price is not None:
                total += price * item.quantity
        return total
