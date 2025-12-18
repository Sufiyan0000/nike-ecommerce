# apps/catalog/management/commands/seed_catalog.py
import random
import shutil
from pathlib import Path
from typing import List

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from apps.catalog.models import (
    Gender,
    Color,
    Size,
    Brand,
    Category,
    Product,
    ProductVariant,
    ProductImage,
    Collection,
    ProductCollection,
)


class Command(BaseCommand):
    help = "Seed catalog data: filters, brands, categories, collections, products, variants, images."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Starting catalog seeding..."))

        with transaction.atomic():
            genders = self._seed_genders()
            colors = self._seed_colors()
            sizes = self._seed_sizes()
            brand = self._seed_brand()
            categories = self._seed_categories()
            collections = self._seed_collections()
            self._seed_products(
                brand=brand,
                genders=genders,
                colors=colors,
                sizes=sizes,
                categories=categories,
                collections=collections,
            )

        self.stdout.write(self.style.SUCCESS("✅ Catalog seeding completed."))

    # ---------- Filters ----------

    def _seed_genders(self) -> List[Gender]:
        data = [
            ("Men", "men"),
            ("Women", "women"),
            ("Kids", "kids"),
        ]
        genders = []
        self.stdout.write("Seeding genders...")
        for label, slug in data:
            gender, created = Gender.objects.get_or_create(
                slug=slug,
                defaults={"label": label},
            )
            genders.append(gender)
            if created:
                self.stdout.write(f"  + Gender: {label}")
        return genders

    def _seed_colors(self) -> List[Color]:
        data = [
            ("Red", "red", "#FF0000"),
            ("Blue", "blue", "#0000FF"),
            ("Black", "black", "#000000"),
            ("White", "white", "#FFFFFF"),
            ("Green", "green", "#00FF00"),
        ]
        colors = []
        self.stdout.write("Seeding colors...")
        for name, slug, hex_code in data:
            color, created = Color.objects.get_or_create(
                slug=slug,
                defaults={"name": name, "hex_code": hex_code},
            )
            colors.append(color)
            if created:
                self.stdout.write(f"  + Color: {name}")
        return colors

    def _seed_sizes(self) -> List[Size]:
        data = [
            ("7", "7", 1),
            ("8", "8", 2),
            ("9", "9", 3),
            ("10", "10", 4),
            ("11", "11", 5),
            ("12", "12", 6),
        ]
        sizes = []
        self.stdout.write("Seeding sizes...")
        for name, slug, sort_order in data:
            size, created = Size.objects.get_or_create(
                slug=slug,
                defaults={"name": name, "sort_order": sort_order},
            )
            sizes.append(size)
            if created:
                self.stdout.write(f"  + Size: {name}")
        return sizes

    # ---------- Brand, Categories, Collections ----------

    def _seed_brand(self) -> Brand:
        self.stdout.write("Seeding brand: Nike...")
        brand, created = Brand.objects.get_or_create(
            slug="nike",
            defaults={"name": "Nike", "logo_url": ""},
        )
        if created:
            self.stdout.write("  + Brand: Nike")
        return brand

    def _seed_categories(self) -> List[Category]:
        self.stdout.write("Seeding categories...")
        root_shoes, _ = Category.objects.get_or_create(
            slug="shoes",
            defaults={"name": "Shoes"},
        )
        running, _ = Category.objects.get_or_create(
            slug="running",
            defaults={"name": "Running", "parent": root_shoes},
        )
        lifestyle, _ = Category.objects.get_or_create(
            slug="lifestyle",
            defaults={"name": "Lifestyle", "parent": root_shoes},
        )
        self.stdout.write("  + Categories: Shoes, Running, Lifestyle")
        return [root_shoes, running, lifestyle]

    def _seed_collections(self) -> List[Collection]:
        self.stdout.write("Seeding collections...")
        data = [
            ("Summer '25", "summer-25"),
            ("Best Sellers", "best-sellers"),
        ]
        collections = []
        for name, slug in data:
            col, created = Collection.objects.get_or_create(
                slug=slug,
                defaults={"name": name},
            )
            collections.append(col)
            if created:
                self.stdout.write(f"  + Collection: {name}")
        return collections

    # ---------- Products, Variants, Images ----------

    def _seed_products(
        self,
        brand: Brand,
        genders: List[Gender],
        colors: List[Color],
        sizes: List[Size],
        categories: List[Category],
        collections: List[Collection],
    ) -> None:
        self.stdout.write("Seeding products, variants & images...")

        # where your raw images exist (e.g. downloaded sample shoes)
        source_images_dir = Path("public/shoes")
        # where you want to copy/store them
        uploads_dir = Path("static/uploads/products")
        uploads_dir.mkdir(parents=True, exist_ok=True)

        product_names = [
            "Nike Air Zoom Pegasus",
            "Nike Air Max Runner",
            "Nike Revolution",
            "Nike Zoom Fly",
            "Nike React Infinity Run",
            "Nike Air Force 1 Low",
            "Nike Air Force 1 High",
            "Nike Metcon Trainer",
            "Nike Flex Experience",
            "Nike ZoomX Vaporfly",
            "Nike Court Vision Low",
            "Nike Legend Essential",
            "Nike Renew Run",
            "Nike Quest Runner",
            "Nike Winflo Performance",
        ]

        available_images = list(source_images_dir.glob("*.jpg")) + list(
            source_images_dir.glob("*.png")
        ) 

        if not available_images:
            self.stdout.write(
                self.style.WARNING(
                    f"  ⚠ No images found in {source_images_dir}. "
                    "Products will still be created but without real files."
                )
            )

        for name in product_names:
            slug = slugify(name)
            category = random.choice(categories[1:])  # running or lifestyle
            gender = random.choice(genders)

            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    "description": f"{name} – premium performance running shoe.",
                    "category": category,
                    "gender": gender,
                    "brand": brand,
                    "is_published": True,
                },
            )
            if created:
                self.stdout.write(f"  + Product: {name}")

            variants = self._create_variants_for_product(
                product=product,
                colors=colors,
                sizes=sizes,
            )

            if variants:
                product.default_variant = variants[0]
                product.save(update_fields=["default_variant"])

            self._attach_collections(product, collections)
            self._create_images_for_product(
                product=product,
                variants=variants,
                available_images=available_images,
                uploads_dir=uploads_dir,
            )

    def _create_variants_for_product(
        self,
        product: Product,
        colors: List[Color],
        sizes: List[Size],
    ) -> List[ProductVariant]:
        variants = []
        base_price = random.randint(4000, 12000) / 100  # 40.00 - 120.00
        for color in random.sample(colors, k=min(3, len(colors))):
            for size in random.sample(sizes, k=min(3, len(sizes))):
                sku = f"{slugify(product.name)[:20].upper()}-{color.slug.upper()}-{size.slug.upper()}"
                sale_price = (
                    base_price - 10 if random.random() > 0.5 else None
                )
                variant, created = ProductVariant.objects.get_or_create(
                    sku=sku,
                    defaults={
                        "product": product,
                        "price": base_price,
                        "sale_price": sale_price,
                        "color": color,
                        "size": size,
                        "in_stock": random.randint(5, 50),
                        "weight": round(random.uniform(0.5, 1.5), 2),
                        "dimensions": {
                            "length": 30,
                            "width": 20,
                            "height": 12,
                        },
                    },
                )
                if created:
                    variants.append(variant)
        return variants

    def _attach_collections(
        self,
        product: Product,
        collections: List[Collection],
    ) -> None:
        # randomly attach 1–2 collections
        selected = random.sample(
            collections, k=random.randint(1, min(2, len(collections)))
        )
        for col in selected:
            ProductCollection.objects.get_or_create(
                product=product,
                collection=col,
            )

    def _create_images_for_product(
        self,
        product: Product,
        variants: List[ProductVariant],
        available_images: List[Path],
        uploads_dir: Path,
    ) -> None:
        if not available_images:
            # Just create fake URLs
            for idx in range(2):
                ProductImage.objects.get_or_create(
                    product=product,
                    sort_order=idx,
                    defaults={
                        "url": f"/static/uploads/products/{slugify(product.name)}-{idx}.jpg",
                        "is_primary": idx == 0,
                    },
                )
            return

        selected_images = random.sample(
            available_images, k=min(3, len(available_images))
        )

        for idx, src in enumerate(selected_images):
            dest_filename = f"{slugify(product.name)}-{idx}{src.suffix}"
            dest_path = uploads_dir / dest_filename

            try:
                shutil.copy2(src, dest_path)
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"    ! Failed to copy {src} -> {dest_path}: {e}"
                    )
                )

            ProductImage.objects.get_or_create(
                product=product,
                sort_order=idx,
                defaults={
                    "url": f"/static/uploads/products/{dest_filename}",
                    "is_primary": idx == 0,
                },
            )
