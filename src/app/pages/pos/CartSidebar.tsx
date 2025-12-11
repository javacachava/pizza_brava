import React from 'react';
import type { OrderItem } from '../../../models/OrderItem';
import { CartItem } from './CartItem';
import { Button } from '../../components/ui/Button';
import { calculateCartTotal } from '../../../utils/pos';

interface Props {
  cart: OrderItem[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onSubmitOrder: () => void;
}

export const CartSidebar: React.FC<Props> = ({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  onSubmitOrder
}) => {
  const total = calculateCartTotal(cart);

  return (
    <div className="bg-white w-80 border-l fixed right-0 top-0 h-full flex flex-col">
      <div className="flex-1 overflow-auto p-3">

        <h2 className="font-semibold text-xl mb-4">Carrito</h2>

        {cart.map(item => (
          <CartItem
            key={item.productId}
            item={item}
            onIncrease={() => item.productId && onIncrease(item.productId)}
            onDecrease={() => item.productId && onDecrease(item.productId)}
            onRemove={() => item.productId && onRemove(item.productId)}
          />
        ))}

        {cart.length === 0 && (
          <p className="text-gray-500 text-sm mt-8 text-center">
            No hay productos
          </p>
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex justify-between font-bold text-lg mb-3">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Button
          onClick={onSubmitOrder}
          disabled={cart.length === 0}
          className="w-full"
        >
          Finalizar Orden
        </Button>
      </div>
    </div>
  );
};
