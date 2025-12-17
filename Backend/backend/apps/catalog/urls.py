# apps/catalog/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProductViewSet,
    ProductVariantViewSet,
    CategoryViewSet,
    CollectionViewSet,
    GenderViewSet,
    ColorViewSet,
    SizeViewSet,
    BrandViewSet,
    ReviewViewSet,
    WishlistViewSet,
)

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("variants", ProductVariantViewSet, basename="variant")
router.register("categories", CategoryViewSet, basename="category")
router.register("collections", CollectionViewSet, basename="collection")
router.register("genders", GenderViewSet, basename="gender")
router.register("colors", ColorViewSet, basename="color")
router.register("sizes", SizeViewSet, basename="size")
router.register("brands", BrandViewSet, basename="brand")
router.register("reviews", ReviewViewSet, basename="review")
router.register("wishlist", WishlistViewSet, basename="wishlist")

urlpatterns = [
    path("", include(router.urls)),
]
