# apps/orders/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Order, OrderItem, Payment, Coupon
from apps.catalog.models.variants import ProductVariant
from apps.catalog.serializers.ProductVariant import ProductVariantSerializer
from apps.accounts.models import Address  # adjust path if different
from apps.accounts.serializers import AddressSerializer  # we define below

User = get_user_model()


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            "id",
            "code",
            "discount_type",
            "discount_value",
            "expires_at",
            "max_usage",
            "used_count",
        ]
        read_only_fields = ["id", "used_count"]


class OrderItemSerializer(serializers.ModelSerializer):
    product_variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all()
    )
    product_variant_detail = ProductVariantSerializer(
        source="product_variant", read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "order",
            "product_variant",
            "product_variant_detail",
            "quantity",
            "price_at_purchase",
        ]
        read_only_fields = ["id", "order", "product_variant_detail"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "method",
            "status",
            "paid_at",
            "transaction_id",
        ]
        read_only_fields = ["id"]


class OrderSerializer(serializers.ModelSerializer):
    """
    Basic serializer for creating/updating orders.
    Items are normally created separately or via custom logic.
    """
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    shipping_address = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all()
    )
    billing_address = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all()
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "status",
            "total_amount",
            "shipping_address",
            "billing_address",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]


class OrderDetailSerializer(OrderSerializer):
    """
    Detailed serializer including items and payments.
    """
    shipping_address = AddressSerializer(read_only=True)
    billing_address = AddressSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + ["items", "payments"]
