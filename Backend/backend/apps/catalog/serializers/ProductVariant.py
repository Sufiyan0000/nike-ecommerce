from rest_framework import serializers

from ..models import Color,Size,ProductVariant,Product

# from .serializers import ProductSerializer

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ["id", "name", "slug", "hex_code"]

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ["id", "name", "slug", "sort_order"]

class ProductVariantSerializer(serializers.ModelSerializer):
    
    product_id = serializers.PrimaryKeyRelatedField(
        queryset = Product.objects.all(),
    )
    color = ColorSerializer(read_only=True)
    size = SizeSerializer(read_only=True)
    color_id = serializers.PrimaryKeyRelatedField(
        source="color",
        queryset=Color.objects.all(),
        write_only=True,
        required=True,
    )
    size_id = serializers.PrimaryKeyRelatedField(
        source="size",
        queryset=Size.objects.all(),
        write_only=True,
        required=True,
    )

    # product = serializers.SerializerMethodField()

    # def get_product(self,obj):
    #     from .serializers import ProductSerializer
    #     return ProductSerializer(obj.product.all(),many=True).data

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "product_id",
            "sku",
            "price",
            "sale_price",
            "color",
            "size",
            "color_id",
            "size_id",
            "in_stock",
            "weight",
            "dimensions",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
