"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../store/cart.store";
import { useState } from "react";
import Lottie from 'lottie-react'
import addToCartAnim from "@/src/assets/addToCart.json"

type ProductImage = {
  url: string;
  is_primary?: boolean;
};

type ProductVariant = {
  id: string;
  price: number;
  sale_price?: number | null;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
};

type CardProps = {
  title?: string;
  product: Product;
  className?: string;
};

export default function Card({ product }: CardProps) {
  if (!product) return null;

  const [showAnim,setShowAnim] = useState(false);

  const imageObj =
    product.images?.find((img) => img.is_primary) ??
    product.images?.[0];

  const imageSrc = imageObj?.url ?? null;

  const basePrice = product.variants?.[0]?.price;
  const salePrice = product.variants?.[0]?.sale_price;
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = async ({productVariantId, quantity}: {productVariantId: string; quantity?: number}) => {
    try {
      // Call addToCart API here
       await addToCart(productVariantId, 1);
      
      // console.log("Added to cart:", res);
    }catch(error){
      console.error("Error adding to cart:", error);
    }

    setShowAnim(true);
    setTimeout(() => setShowAnim(false), 2000);
    
  }

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-80 mx-auto md:w-[22rem] md:mr-5">
      {/* IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        {/* NAME */}
        <Link href={`/products/${product.id}`} className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </Link>

        {/* DESCRIPTION */}
        <Link href={`/products/${product.id}`} className="text-sm text-gray-500 line-clamp-2 ">
          {product.description}
        </Link>

        {/* PRICE */}
        {basePrice !== undefined && (
          <div className="flex items-center gap-2 pt-1">
            {salePrice ? (
              <>
                <span className="text-lg font-bold text-emerald-600">
                  ${salePrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${basePrice}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${basePrice}
              </span>
            )}
          </div>
        )}

        {/* ADD TO CART */}
        <div className="relative group pb-3">
          <button
          className={`mt-3 w-full rounded-lg ${showAnim? 'bg-neutral-200 text-neutral-800 ':'bg-gray-900 text-neutral-100'}  text-sm font-medium py-2
          lg:opacity-0 translate-y-2 transition-all duration-300
          group-hover:lg:opacity-100 group-hover:translate-y-0
          ${showAnim? 'hover:bg-neutral-200':'hover:bg-neutral-900'} hover:cursor-pointer`}
          onClick={() => handleAddToCart({productVariantId: product.variants?.[0]?.id ?? '', quantity: 1})}
        >
          {showAnim ? 
          'Congratulations! Item Added': 'Add To Cart'}
        </button>
         {/* LOTTIE ANIMATION */}
        </div>
        
      </div>
    </div>
  );
}
