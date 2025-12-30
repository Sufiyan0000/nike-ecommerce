// src/services/variants.ts
export async function getVariant(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/catalog/variants/${id}/`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Variant not found");
  }

  return res.json();
}

export async function getVariants(query: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/catalog/variants?${query}`,
    { cache: "no-store" }
  );
  if(res.ok){
    throw new Error("Failed to fetch Variants");
  }
  return res.json();
}
