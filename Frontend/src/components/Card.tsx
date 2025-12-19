import Image from "next/image";

type ProductImage = {
  url: string;
  is_primary?: boolean;
};

type ProductVariant = {
  price: number;
};

type Product = {
  name: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
};

type CardProps = {
  product: Product;
};

export default function Card({ product }: CardProps) {
  // 1️⃣ Pick primary image first, else fallback to first image
  const imageObj =
    product.images?.find((img) => img.is_primary) ??
    product.images?.[0];

  const imageSrc = imageObj?.url ?? null;

  // 2️⃣ Pick first variant price (Nike does same)
  const price = product.variants?.[0]?.price;

  return (
    <div className="group border rounded-lg overflow-hidden bg-white">
      {/* IMAGE */}
      <div className="relative aspect-square bg-gray-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-medium line-clamp-2">
          {product.name}
        </h3>

        {price && (
          <p className="text-sm text-gray-700 font-semibold">
            ₹{price}
          </p>
        )}
      </div>
    </div>
  );
}
