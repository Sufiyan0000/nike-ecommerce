# apps/catalog/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers

from ..models.products import Product, ProductImage
from ..models.categories import Category
from ..models.collections import Collection, ProductCollection
from ..models.reviews import Review
from ..models.filters.genders import Gender
from ..models.brands import Brand
from ..models.wishlists import Wishlist  # if you created it here
from .ProductVariant import ProductVariantSerializer

User = get_user_model()


# ---------- Filter / taxonomy serializers ----------

class GenderSerializer(serializers.ModelSerializer):
    filterset = ["id",]
    class Meta:
        model = Gender
        fields = ["id", "label", "slug"]



class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "slug", "logo_url"]


class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.PrimaryKeyRelatedField(
        read_only=True
    )  # or nested if you want

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "parent"]


# ---------- Product-related serializers ----------

class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["url", "is_primary", "sort_order"]

    def get_url(self, obj):
        request = self.context.get("request")

        if not obj.image:
            return None

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url  # fallback



class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    gender = GenderSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    # default_variant = ProductVariantSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.all(), write_only=True
    )
    gender_id = serializers.PrimaryKeyRelatedField(
        source="gender", queryset=Gender.objects.all(), write_only=True
    )
    brand_id = serializers.PrimaryKeyRelatedField(
        source="brand", queryset=Brand.objects.all(), write_only=True
    )
    images = ProductImageSerializer(many=True, read_only=True) # Why many = True? Does it makes one product having more than one image url?
    variants = serializers.SerializerMethodField()

    def get_variants(self,obj):
        from .ProductVariant import ProductVariantSerializer
        return ProductVariantSerializer(obj.variants.all(),many=True).data
    
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "category",
            "category_id",
            "gender",
            "gender_id",
            "brand",
            "brand_id",
            "is_published",
            "variants",
            "created_at",
            "updated_at",
            "images",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "variants", "images"]



class ReviewUserSerializer(serializers.ModelSerializer):
    """Lightweight user representation in reviews."""

    class Meta:
        model = User
        fields = ["id", "email", "name", "image"]


class ReviewSerializer(serializers.ModelSerializer):
    user = ReviewUserSerializer(read_only=True)
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all()
    )

    class Meta:
        model = Review
        fields = [
            "id",
            "product",
            "user",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class ProductDetailSerializer(ProductSerializer):
    """
    Detailed product view: includes variants and reviews.
    """
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ["variants", "reviews"]


# ---------- Collections ----------

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "name", "slug", "created_at"]
        read_only_fields = ["id", "created_at"]


# ---------- Wishlist ----------

class WishlistProductSerializer(serializers.ModelSerializer):
    """Compact product for wishlist listing."""

    class Meta:
        model = Product
        fields = ["id", "name"]


class WishlistSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    product = WishlistProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source="product", queryset=Product.objects.all(), write_only=True
    )

    class Meta:
        model = Wishlist
        fields = [
            "id",
            "user",
            "product",
            "product_id",
            "added_at",
        ]
        read_only_fields = ["id", "user", "product", "added_at"]
