import { notFound } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";

import { PRODUCTS } from "@/src/lib/mock-products";
import ProductGallery from "@/src/components/ProductGallery";
import SizePicker from "@/src/components/SizePicker";
import CollapsibleSection from "@/src/components/CollapsibleSection";
import Card from "@/src/components/Card";
import { parseQuery } from "@/src/lib/utils/query";
import { getProductById, getProducts } from "@/src/services/products";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const {id} = await params;
  const product = await getProductById(id)

  console.log("Product by Id : ",product)

  if (!product) notFound();

  const defaultVariant = product.variants?.[0];

  if (!defaultVariant) notFound();

  const price = Number(defaultVariant.sale_price ?? defaultVariant.price);
  const compareAt = Number(defaultVariant.price)

  const discount =
  defaultVariant.sale_price
    ? Math.round(((compareAt - price) / compareAt) * 100)
    : 0;

    const galleryVariants = product.variants.reduce((acc: any[], v: any) => {
  const colorSlug = v.color.slug;

  let existing = acc.find((x) => x.color === colorSlug);

  if (!existing) {
    existing = {
      color: v.color.name,
      swatch: v.color.hex_code ?? "#000",
      images: product.images.map((img: any) => img.url),
    };
    acc.push(existing);
  }

  return acc;
}, []);



  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* GALLERY */}
        <ProductGallery variants={galleryVariants} />

        {/* PRODUCT INFO */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold">
              $ {price.toLocaleString()}
            </span>

            {defaultVariant.sale_price && (
              <>
               <span className="line-through text-gray-400">
              $ {compareAt.toLocaleString()}
            </span>
            <span className="text-green-600 font-medium">
              {discount}% off
            </span>
              </>
            )}
            
          </div>

          {/* RATINGS */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} fill="black" />
            ))}
            <span className="text-sm text-gray-500 ml-2">(0 Reviews)</span>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>

          <SizePicker />

          {/* CTA */}
          <div className="flex gap-4">
            <button className="flex-1 bg-black text-white py-4 rounded-full flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              Add to Bag
            </button>

            <button className="w-14 h-14 border rounded-full flex items-center justify-center">
              <Heart size={20} />
            </button>
          </div>

          {/* COLLAPSIBLE */}
          <CollapsibleSection title="Product Details">
            Premium running shoe designed for everyday training.
          </CollapsibleSection>

          <CollapsibleSection title="Shipping & Returns">
            Free delivery and 30-day returns.
          </CollapsibleSection>

          <CollapsibleSection title="Reviews">
            No reviews yet.
          </CollapsibleSection>
        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      <section className="mt-20">
        <h2 className="text-xl font-semibold mb-6">
          You Might Also Like
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
  {PRODUCTS.map((item) => (
    <Card
      key={item.id}
      className=""
      product={{
        description:"something",
        id: item.id,
        slug: item.id, // mock slug
        name: item.title, // map title → name
        images: item.images.map((img, index) => ({
          url: img,
          is_primary: index === 0,
        })),
        variants: [
          {
            price: item.price,
          },
        ],
      }}
    />
  ))}
</div>

      </section>
    </section>
  );
}
