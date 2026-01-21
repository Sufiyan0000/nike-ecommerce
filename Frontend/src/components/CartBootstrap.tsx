"use client";

import { useEffect } from "react";
import { useCartStore } from "@/src/store/cart.store";

export default function CartBootstrap() {
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    fetchCart();
  }, []);

  return null;
}
