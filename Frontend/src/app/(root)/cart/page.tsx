"use client";

import CartItem from "@/src/components/cart/CartItem";
import CartSummary from "@/src/components/cart/CartSummary";

const cartItems = [
  {
    id: 1,
    name: "Nike Air Max 90",
    price: 7999,
    quantity: 1,
    size: "9",
    image:
      "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/air-max-90.png",
  },
];

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 lg:px-24">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold tracking-tight mb-10">
        Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <CartSummary />
      </div>
    </div>
  );
}
