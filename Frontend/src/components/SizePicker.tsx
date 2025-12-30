"use client";

import { useState } from "react";

const SIZES = ["7", "8", "9", "10", "11", "12"];

export default function SizePicker() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <p className="font-medium">Select Size</p>

      <div className="grid grid-cols-3 gap-3">
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => setSelected(size)}
            className={`py-3 border rounded-md ${
              selected === size ? "border-black" : "border-gray-300"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
