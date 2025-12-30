"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  parseQuery,
  toggleMultiValue,
  stringifyQuery,
} from "@/src/lib/utils/query";
import { useState } from "react";

const FILTERS = {
  gender: {
    type: "single",
    options: ["men", "women", "kids"],
  },
  size: {
    type: "multi",
    options: ["7", "8", "9", "10", "11", "12"],
  },
  color: {
    type: "multi",
    options: ["red", "black", "white", "green", "blue", "grey"],
  },
};

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = parseQuery(searchParams);

  function toggle(key: string, value: string, type: "single" | "multi") {
    let updated;

    if (type === "single") {
      updated = {
        ...query,
        [key]: query[key] === value ? undefined : value,
        page: undefined,
      };
    } else {
      updated = toggleMultiValue(query, key, value);
    }

    router.push(`/products?${stringifyQuery(updated)}`);
  }

  const hasActiveFilters = Object.keys(query).some(
    (key) => key !== "page"
  );

  return (
    <div className="space-y-6">
      {Object.entries(FILTERS).map(([key, config]) => {
        const { options, type } = config;
        const raw = query[key];

        const selectedValues = Array.isArray(raw)
          ? raw
          : raw
          ? [raw]
          : [];

        const selectedCount = selectedValues.length;
        const isTwoColumn = key === "size" || key === "color";

        return (
          <div key={key}>
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold capitalize text-lg">
                  {key}
                </h3>

                {selectedCount > 0 && (
                  <span className="text-sm font-semibold text-gray-600">
                    ({selectedCount})
                  </span>
                )}
              </div>

              {hasActiveFilters && key === "gender" && (
                <button
                  onClick={() => router.push("/products")}
                  className="text-sm underline font-semibold text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* OPTIONS */}
            <div
              className={`grid gap-1 ${
                isTwoColumn
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {options.map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(value)}
                    onChange={() => toggle(key, value, type)}
                    className={`accent-gray-800`}
                  />
                  <span className={`capitalize text-${value}-500`}>{value}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
