import { notFound } from "next/navigation";
import { Heart, ShoppingBag, Star } from "lucide-react";
import ProductGallery from "@/src/components/ProductGallery";
import CollapsibleSection from "@/src/components/CollapsibleSection";
import Card from "@/src/components/Card";
import { getProductById, getProducts } from "@/src/services/products";
import AddToCartSection from "@/src/components/AddToCartSection";
import { SizeVariant } from "@/src/types/cart";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Record<string,string | string[] | undefined>;
};
;


export default async function ProductPage({ params }: PageProps) {
  
  const {id} = await params;
  // console.log('ID: ',id)
  const product = await getProductById(id)
  console.log('Product: ',product)

  const sizeVariants: SizeVariant[] = Array.from(
    new Map<string,SizeVariant>(
      product.variants.map((v: any) => [
        v.size.id,
        {
          id: v.size.id,
          size: Number(v.size.name),
        }
      ])
    ).values()
  ).sort((a:any,b:any) => a.size - b.size);

  console.log('Size Variant: ',sizeVariants)

  const relatedData = await getProducts({
  category: product.category.slug,
  page_size: "4",
});

// console.log("Related Data:",relatedData )

const relatedProducts = relatedData.results;


  if (!product) notFound();

  const defaultVariant = product.variants?.[0];

  console.log("Default Variant: ",defaultVariant)

  if (!defaultVariant) notFound();

  const price = Number(defaultVariant.sale_price ?? defaultVariant.price);
  const compareAt = Number(defaultVariant.price)

  const discount =
  defaultVariant.sale_price
    ? Math.round(((compareAt - price) / compareAt) * 100)
    : 0;

  const galleryVariants = product.variants.reduce((acc: any[], v: any) => {
  const colorSlug = v.color.slug;

  let existing = acc.find((x) => x.id === colorSlug);

  if (!existing) {
    existing = {
      id: colorSlug, // ✅ FIXED
      color: v.color.name,
      swatch: v.color.hex_code ?? "#000",
      images: product.images.map((img:any) => img.url),
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

          <AddToCartSection
          variants={sizeVariants}
          productVariantId={defaultVariant.id}
/>
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
  {relatedProducts
      .filter((p) => p.id !== product.id) // ❗ exclude current product
      .slice(0, 3) // show only 3
      .map((item) => (
        <Card
          key={item.id}
          product={{
            id: item.id,
            slug: item.slug,
            name: item.name,
            description: item.description ?? "",
            images: item.images,
            variants: item.variants,
          }}
        />
      ))}
</div>

      </section>
    </section>
  );
}
