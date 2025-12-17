# apps/catalog/views.py

from rest_framework import viewsets, mixins, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Prefetch

from .models.products import Product, ProductImage
from .models.variants import ProductVariant
from .models.categories import Category
from .models.collections import Collection, ProductCollection
from .models.reviews import Review
from .models.filters.genders import Gender
from .models.filters.colors import Color
from .models.filters.sizes import Size
from .models.brands import Brand  # if you created a separate brands.py
from .models.wishlists import Wishlist  # if separate file

from .serializers import (
    ProductSerializer,
    ProductDetailSerializer,
    ProductVariantSerializer,
    CategorySerializer,
    CollectionSerializer,
    ReviewSerializer,
    GenderSerializer,
    ColorSerializer,
    SizeSerializer,
    BrandSerializer,
    WishlistSerializer,
)

from apps.core.permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly


# ---------- Catalog: read-only for users, writable for admin ----------

class ProductViewSet(viewsets.ModelViewSet):
    """
    /api/catalog/products/
    List, retrieve, search, filter products.
    Admins can create/update/delete.
    """
    queryset = (
        Product.objects
        .select_related("category", "gender", "brand", "default_variant")
        .prefetch_related(
            "variants",
            "images",
            Prefetch("reviews", queryset=Review.objects.select_related("user")),
        )
        .all()
    )
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "brand__name", "category__name"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        # You can use a different serializer for detail view if needed
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductSerializer

    @action(detail=True, methods=["get"], permission_classes=[permissions.AllowAny])
    def variants(self, request, pk=None):
        """
        /api/catalog/products/{id}/variants/
        Get variants for a product.
        """
        product = self.get_object()
        qs = product.variants.select_related("color", "size")
        serializer = ProductVariantSerializer(qs, many=True)
        return Response(serializer.data)


class ProductVariantViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only list of variants.
    Usually you don't let users create variants; admin uses Django admin.
    """
    queryset = ProductVariant.objects.select_related("product", "color", "size").all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.AllowAny]


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.select_related("parent").all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [permissions.AllowAny]


class GenderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Gender.objects.all()
    serializer_class = GenderSerializer
    permission_classes = [permissions.AllowAny]


class ColorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = [permissions.AllowAny]


class SizeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Size.objects.all().order_by("sort_order")
    serializer_class = SizeSerializer
    permission_classes = [permissions.AllowAny]


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]


# ---------- Reviews (user-owned content) ----------

class ReviewViewSet(viewsets.ModelViewSet):
    """
    /api/catalog/reviews/
    - List/filter reviews
    - Authenticated users can create
    - Owners (or admin) can edit/delete
    """
    queryset = Review.objects.select_related("product", "user").all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ---------- Wishlist (per-user) ----------

class WishlistViewSet(viewsets.ModelViewSet):
    """
    /api/catalog/wishlist/
    - Returns wishlist for current user
    - POST to add product
    - DELETE to remove
    """
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return (
            Wishlist.objects
            .filter(user=self.request.user)
            .select_related("product")
            .order_by("-added_at")
        )

    def perform_create(self, serializer):
        # Prevent duplicates at app level (also enforce unique_together in model)
        instance = serializer.save(user=self.request.user)
        return instance
