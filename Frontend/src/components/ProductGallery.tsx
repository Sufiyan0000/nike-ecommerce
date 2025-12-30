"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ImageOff } from "lucide-react";

type Variant = {
  color: string;
  swatch: string;
  images: string[];
};

export default function ProductGallery({
  variants,
}: {
  variants: Variant[];
}) {
  const [activeVariant, setActiveVariant] = useState(variants[0]);
  const [activeImage, setActiveImage] = useState(
    variants[0]?.images?.[0]
  );

  if (!activeVariant?.images?.length) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <ImageOff size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE */}
      <div className="order-1 h-[500px] relative bg-light-200 lg:order-2">
        <Image
          src={activeImage}
          alt={activeVariant.color}
          fill
          className="object-contain"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 overflow-x-auto">
        {activeVariant.images.map((img) => (
          <button
            key={img}
            onClick={() => setActiveImage(img)}
            className={`border ${
              img === activeImage ? "border-black" : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt=""
              width={60}
              height={60}
              className="object-contain"
            />
          </button>
        ))}
      </div>

      {/* COLOR SWATCHES */}
      <div className="flex gap-3">
        {variants.map((v) => (
          <button
            key={v.color}
            onClick={() => {
              setActiveVariant(v);
              setActiveImage(v.images[0]);
            }}
            className="relative w-8 h-8 rounded-full border"
            style={{ backgroundColor: v.swatch }}
            aria-label={v.color}
          >
            {v === activeVariant && (
              <Check className="absolute inset-0 m-auto text-white" size={14} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
