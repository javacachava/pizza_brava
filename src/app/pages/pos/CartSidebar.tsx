// src/app/pages/pos/CartSidebar.tsx
import React from 'react';
import type { OrderItem } from '../../../models/OrderItem';
import { formatPrice } from '../../../utils/format';

interface Props {
  cart: OrderItem[];
  onIncrease: (index: number) => void;
  onDecrease: (index: number) => void;
  onRemove: (index: number) => void;
  onSubmitOrder: () => void;
}

export const CartSidebar: React.FC<Props> = ({ cart, onIncrease, onDecrease, onRemove, onSubmitOrder }) => {
  const total = cart.reduce((acc, it) => acc + (it.totalPrice ?? 0), 0);

  return (
    <aside className="w-80 fixed right-0 top-0 h-full bg-white p-4 shadow-xl overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Carrito</h2>
        <div className="text-sm text-gray-500">{cart.length} items</div>
      </div>

      <div className="space-y-3">
        {cart.length === 0 && <div className="text-sm text-gray-500">El carrito está vacío</div>}

        {cart.map((item, idx) => (
          <div key={`${item.productId}-${idx}`} className="flex items-center justify-between bg-gray-50 rounded-xl p-3 shadow-sm">
            <div className="flex-1">
              <div className="font-medium text-sm">{item.productName}</div>
              <div className="text-xs text-gray-500">{item.selectedOptions?.length ? item.selectedOptions.join(', ') : ''}</div>
              <div className="text-sm mt-1">{formatPrice(item.totalPrice)}</div>
            </div>

            <div className="flex flex-col items-center ml-3">
              <div className="flex items-center space-x-2 mb-2">
                <button
                  className="px-2 py-1 rounded-lg border"
                  onClick={() => onDecrease(idx)}
                  aria-label={`Disminuir ${item.productName}`}
                >
                  −
                </button>
                <div className="px-2">{item.quantity}</div>
                <button
                  className="px-2 py-1 rounded-lg border"
                  onClick={() => onIncrease(idx)}
                  aria-label={`Aumentar ${item.productName}`}
                >
                  +
                </button>
              </div>

              <button
                className="text-red-600 text-xs"
                onClick={() => onRemove(idx)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-lg font-bold">{formatPrice(total)}</div>
        </div>

        <button
          className="w-full mt-2 px-4 py-3 bg-emerald-600 text-white rounded-lg text-lg"
          onClick={onSubmitOrder}
        >
          Enviar orden
        </button>
      </div>
    </aside>
  );
};

export default CartSidebar;
