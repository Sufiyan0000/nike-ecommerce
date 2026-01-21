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

export default function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex gap-6 border-b pb-8">
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="h-28 w-28 object-contain bg-gray-100"
      />

      {/* Details */}
      <div className="flex flex-1 justify-between">
        <div>
          <h2 className="font-medium">{item.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Men&apos;s Shoes</p>
          <p className="text-sm text-gray-500">Size {item.size}</p>

          {/* Actions */}
          <div className="flex gap-6 text-sm text-gray-600 mt-4">
            <button className="hover:text-black">Remove</button>
            <button className="hover:text-black">Move to Favourites</button>
          </div>
        </div>

        {/* Price + Quantity */}
        <div className="text-right">
          <p className="font-medium">₹ {item.price.toLocaleString()}</p>

          <select
            defaultValue={item.quantity}
            className="mt-4 border px-2 py-1 text-sm"
          >
            {[1, 2, 3, 4, 5].map((q) => (
              <option key={q} value={q}>
                Qty {q}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
