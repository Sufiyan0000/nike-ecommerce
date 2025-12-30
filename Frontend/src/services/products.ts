import qs from "query-string";

export async function getProducts(query: any) {
  const queryString = qs.stringify(query, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/catalog/products/?${queryString}`,
    { cache: "no-store" ,
    next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.results ?? [];
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
