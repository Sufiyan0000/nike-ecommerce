import { useCartStore } from '@/src/store/cart.store';
import React from 'react'
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartView = () => {
    const cart = useCartStore((state) => state.cart)

    // console.log("Cart in CartView: ",cart?.items)

    if(!cart){
        return <p className='py-10 text-center'>Loading Cart....</p>
    }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        {cart.items.length === 0 ? (
          <p>Your bag is empty.</p>
        ) : (
          cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))
        )}
      </div>

      <CartSummary />
    </div>
  );
}

export default CartView