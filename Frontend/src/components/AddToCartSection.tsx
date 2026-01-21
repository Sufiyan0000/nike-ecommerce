"use client";

import { ShoppingBag, Heart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/src/store/cart.store";
import SizePicker from "@/src/components/SizePicker";
import { SizeVariant } from "../types/cart";

type Props = {
  variants: SizeVariant[];
};

export default function AddToCartSection({ variants }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <>
      {/* SIZE PICKER */}
      <SizePicker
        variants={variants}
        selected={selectedVariant}
        onSelect={setSelectedVariant}
      />

      {/* CTA */}
      <div className="flex gap-4 mt-6">
        <button
          disabled={!selectedVariant}
          onClick={() => addItem(selectedVariant!)}
          className="flex-1 bg-black text-white py-4 rounded-full
                     flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={18} />
          Add to Bag
        </button>

        <button className="w-14 h-14 border rounded-full flex items-center justify-center">
          <Heart size={20} />
        </button>
      </div>
    </>
  );
}
