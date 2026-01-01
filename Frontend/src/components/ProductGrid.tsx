"use client";

import { useState } from "react";
import Card from "./Card";
import type { Product } from "@/src/services/products";

type Props = {
  initialProducts: Product[];
  next: string | null;
};

export default function ProductGrid({
  initialProducts,
  next,
}: Props) {
  // ✅ initialize from props
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [nextUrl, setNextUrl] = useState<string | null>(next);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!nextUrl) return;

    setLoading(true);

    const res = await fetch(nextUrl);
    const data = await res.json();

    // ✅ append new products
    setProducts((prev) => [...prev, ...(data.results ?? [])]);
    setNextUrl(data.next ?? null);

    setLoading(false);
  }

  return (
    <>
      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="col-span-full text-gray-500">
            No products found 😕
          </p>
        ) : (
          products.map((product) => (
            <Card key={product.id} product={product} />
          ))
        )}
      </div>

      {/* LOAD MORE BUTTON */}
      {nextUrl && (
        <div className="flex justify-center my-10">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 border border-black rounded-full text-sm font-medium
                       hover:bg-black hover:text-white transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}
