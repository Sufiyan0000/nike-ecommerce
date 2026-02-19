'use client';

import CartItem from "@/src/components/cart/CartItem";
import CartSummary from "@/src/components/cart/CartSummary";
import CartView from "@/src/components/cart/CartView";
import { getCart } from "@/src/lib/api";
import { useCartStore } from "@/src/store/cart.store";
import { useEffect } from "react";

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
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  },[fetchCart])

  return (
    <CartView />
  );
}
