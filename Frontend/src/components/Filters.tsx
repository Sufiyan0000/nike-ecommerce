"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  parseQuery,
  toggleMultiValue,
  stringifyQuery,
} from "@/src/lib/utils/query";

const FILTERS = {
  gender: ["men", "women"],
  size: ["S", "M", "L", "XL"],
  color: ["red", "black", "white"],
};

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = parseQuery(Object.fromEntries(searchParams.entries()));

  function toggle(key: string, value: string) {
    const updated = toggleMultiValue(query, key, value);
    router.push(`/products?${stringifyQuery(updated)}`);
  }

  return (
    <div className="space-y-6">
      {Object.entries(FILTERS).map(([key, options]) => {
        const raw = query[key];

        // ✅ NORMALIZE query value → always array
        const selectedValues = Array.isArray(raw)
          ? raw
          : typeof raw === "string"
          ? [raw]
          : [];

        return (
          <div key={key}>
            <h3 className="font-medium capitalize">{key}</h3>

            {options.map((value) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => toggle(key, value)}
                />
                {value}
              </label>
            ))}
          </div>
        );
      })}
    </div>
  );
}
