export default function CartSummary() {
  const subtotal = 7999;
  const delivery = 0;

  return (
    <div className="border p-6 h-fit">
      <h2 className="text-lg font-medium mb-6">Summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹ {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span>Estimated Delivery</span>
          <span>Free</span>
        </div>

        <div className="border-t pt-4 flex justify-between font-medium text-base">
          <span>Total</span>
          <span>₹ {subtotal.toLocaleString()}</span>
        </div>
      </div>

      <button className="mt-8 w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-900 transition">
        Member Checkout
      </button>
    </div>
  );
}
