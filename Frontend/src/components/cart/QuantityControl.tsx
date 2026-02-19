"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/src/store/cart.store";
import { addToCart } from "@/src/lib/api";

type Props = {
  itemId: string;
  quantity: number;
  max?: number;
};

export default function QuantityControl({ itemId, quantity, max = 10 }: Props) {
  const addToCart = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  let quantityLocal = quantity;

  const handleIncrease = () => {
    console.log("Inside HandleIncrease")
    if (quantity < max) {
      addToCart(itemId, 1);
    }else{
      return;
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      removeItem(itemId);
    } else {
      // if qty = 1 → remove item
      removeItem(itemId);
    }
  };

  return (
    <div >
      <div className="flex items-center border border-neutral-400 rounded-full px-3 py-1 gap-2 w-30 text-lg text-neutral-600">
         <button
        onClick={handleDecrease}
        className="p-1 rounded-full hover:bg-gray-100 transition hover:cursor-pointer"
      >
        {quantity == 1? <Trash2 size={20}/> :<Minus size={22} />}
      </button>
      <span className="text-center font-medium">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        className={`p-2 rounded-full ${quantity == max ? '' : 'hover:bg-gray-100 '} transition hover:cursor-pointer`}
        disabled={quantity == max}
      >
        <Plus size={20} className={`${quantity ==10 ? 'text-neutral-200':'text-neutral-900'}`} />
      </button>
      </div>
  
      <div>
        {quantity == max && <span className="text-sm text-red-600">
            you have reached the maximum limit !
          </span>}
      </div>
    </div>
    
  );
}
