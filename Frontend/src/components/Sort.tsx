"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { parseQuery, setSingleValue, stringifyQuery } from "@/src/lib/utils/query";

export default function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = parseQuery(Object.fromEntries(searchParams.entries()));

  function changeSort(value: string) {
    const updated = setSingleValue(query, "ordering", value);
    router.push(`/products?${stringifyQuery(updated)}`);
  }

  return (
    <select
      value={query.ordering || ""}
      onChange={(e) => changeSort(e.target.value)}
      className="border p-2"
    >
      <option value="">Featured</option>
      <option value="-created_at">Newest</option>
      <option value="variants__price">Price: Low → High</option>
      <option value="-variants__price">Price: High → Low</option>
    </select>
  );
}
