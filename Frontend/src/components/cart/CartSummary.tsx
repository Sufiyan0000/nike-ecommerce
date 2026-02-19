import { useCartStore } from "@/src/store/cart.store";

export default function CartSummary() {

  const cart = useCartStore((state) => state.cart);

  const deliveryFee = Math.round(Math.random() * 10) + 5;

  return (
    <div className="border-2 border-neutral-200 shadow-2xl p-6 h-fit mx-10 lg:mr-10 lg:mt-10 lg:fixed top-10 right-0 lg:w-1/4 bg-white">
      <h2 className="text-2xl font-semibold mb-6">Summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between text-base">
          <span>Subtotal</span>
          <span>$ {cart?.total_amount}</span>
        </div>

        <div className="flex justify-between text-base">
          <span>Total Items</span>
          <span>{cart?.total_items}</span>
        </div>

        <div className="flex justify-between text-base">
          <span>Estimated Delivery Charge <span className="text-green-500">&apos; free &apos;</span></span>
          <span className="line-through">$ {deliveryFee}</span>
        </div>

        <div className="border-t border-neutral-400 pt-4 flex justify-between font-medium text-xl">
          <span>Total</span>
          <span>$ {cart?.total_amount}</span>
        </div>
      </div>

      <button className="mt-8 w-full bg-black text-white py-4 text-base font-medium shadow-xl hover:bg-gray-800 transition hover:cursor-pointer">
        Member Checkout
      </button>
    </div>
  );
}
