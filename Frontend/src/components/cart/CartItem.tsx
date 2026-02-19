import { useCartStore } from "@/src/store/cart.store";
import QuantityControl from "./QuantityControl";

type CartItemProps = {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
  };
};

type Props = {
  item: any;
};

export default function CartItem({ item }: Props) {
  // console.log("CartItem Component Item: ",item)

  const removeItem = useCartStore((state) => state.removeItem);

  const clearCart = useCartStore((state) => state.clearCart);

  const handleRemoveItem = () => {
    removeItem(item.product_variant_detail.id);
  };

  const handleClearCart = () => {
    clearCart();
  }

  return (
    <div className="flex gap-6 border-b border-neutral-300 pb-8 mx-10 mt-10">
      {/* Image */}
      <img
        src={`http://127.0.0.1:8000${item.product_images[0].url}`}
        alt={item.name}
        className="h-28 w-28 object-contain bg-gray-100"
      />

      {/* Details */}
      <div className="flex flex-1 justify-between">
        <div>
          <h2 className="font-medium">{item.product_variant_detail.sku}</h2>
          <p className="text-sm text-gray-500 mt-1">Men&apos;s Shoes</p>
          <p className="text-sm text-gray-500">
            Size {item.product_variant_detail.size.name}
          </p>

          {/* Actions */}
          <div className="mt-4 flex">
              <QuantityControl
                itemId={item.product_variant_detail.id}
                quantity={item.quantity}
                max={10}
              />
            </div>
        </div>

        {/* Price + Quantity */}
        <div className="text-right">
          <div className="text-right">
            <p className="font-medium">$ {item.product_variant_detail.price * item.quantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
