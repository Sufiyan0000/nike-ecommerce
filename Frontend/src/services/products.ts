import qs from "query-string";

/* ---------------- TYPES ---------------- */

export type ProductImage = {
  url: string;
  is_primary?: boolean;
};

export type ProductVariant = {
  price: number;
  sale_price?: number | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
};

export type ProductResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
};

/* ---------------- API ---------------- */

export async function getProducts(query: Record<string, any>): Promise<ProductResponse> {
  const queryString = qs.stringify(query, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/catalog/products/?${queryString}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  // ✅ NORMALIZE RESPONSE
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }

  // ✅ PAGINATED RESPONSE
  return {
    count: data.count ?? data.results?.length ?? 0,
    next: data.next ?? null,
    previous: data.previous ?? null,
    results: data.results ?? [],
  };
}



export async function getProductById(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/catalog/products/${id}/`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}
