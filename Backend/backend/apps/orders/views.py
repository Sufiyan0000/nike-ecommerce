# apps/orders/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from django.contrib.auth import get_user_model

from .models import Order, OrderItem, Payment, Coupon
from .serializers import (
    OrderSerializer,
    OrderDetailSerializer,
    OrderItemSerializer,
    PaymentSerializer,
    CouponSerializer,
)

from apps.core.permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly

User = get_user_model()


class OrderViewSet(viewsets.ModelViewSet):
    """
    /api/orders/
    - Auth users can create orders
    - Users see their own orders
    - Admin can see all
    """
    queryset = Order.objects.select_related(
        "user", "shipping_address", "billing_address"
    ).all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(user=user)

    def get_serializer_class(self):
        if self.action in ["retrieve", "list"]:
            return OrderDetailSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"], url_path="mark-paid", permission_classes=[permissions.IsAdminUser])
    def mark_paid(self, request, pk=None):
        """
        POST /api/orders/{id}/mark-paid/
        Simple admin action to mark order as paid (for testing).
        """
        order = self.get_object()
        order.status = Order.Status.PAID  # assuming you used TextChoices
        order.save(update_fields=["status"])
        return Response(OrderDetailSerializer(order).data)


class OrderItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Typically, order items are not edited separately by users.
    """
    queryset = OrderItem.objects.select_related("order", "product_variant").all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(order__user=user)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related("order").all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(order__user=user)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsAdminOrReadOnly]
