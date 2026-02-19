"use client";

type Variant = {
  id: string;
  size: number;
};

type Props = {
  variants: Variant[];
  selected: string | null;
  onSelect: (id: string) => void;
};

export default function SizePicker({ variants, selected, onSelect }: Props) {
  console.log("Variants: ",variants)

  return (
    <div>
      <p className="mb-2 font-medium">Select Size</p>

      <div className="grid grid-cols-3 gap-3">
        {variants.map((v) => (
          
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={`border rounded-md py-3
              ${selected === v.id
                ? "border-black"
                : "border-gray-300"}
            `}
          >
            {v.size}
          </button>
        ))}
      </div>
    </div>
  );
}
