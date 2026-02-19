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
    <div className="border-t border-neutral-400 pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          className={`text-neutral-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="mt-4 text-gray-600">{children}</div>}
    </div>
  );
}
