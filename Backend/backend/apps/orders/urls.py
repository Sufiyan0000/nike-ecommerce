# apps/orders/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet, PaymentViewSet, CouponViewSet

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="order")
router.register("order-items", OrderItemViewSet, basename="order-item")
router.register("payments", PaymentViewSet, basename="payment")
router.register("coupons", CouponViewSet, basename="coupon")

urlpatterns = [
    path("", include(router.urls)),
]
