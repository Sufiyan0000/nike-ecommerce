import qs from "query-string";

export async function getProducts(query: any) {
  const queryString = qs.stringify(query, { arrayFormat: "comma" }); 

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/?${queryString}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  // ✅ DRF pagination fix
  return Array.isArray(data) ? data : data.results ?? [];
}

