"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="mt-4 text-gray-600">{children}</div>}
    </div>
  );
}
