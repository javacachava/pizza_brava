import React from 'react';
import type { OrderItem } from '../../../models/OrderItem';
import { formatPrice } from '../../../utils/format';

interface Props {
  cart: OrderItem[];
  onIncrease: (index: number) => void;
  onDecrease: (index: number) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  onProcess: () => void;
}

export const CartSidebar: React.FC<Props> = ({ 
  cart, 
  onIncrease, 
  onDecrease, 
  onClear,
  onProcess 
}) => {
  const total = cart.reduce((acc, it) => acc + (it.totalPrice ?? 0), 0);

  return (
    <aside className="w-80 fixed right-0 top-0 h-full bg-white flex flex-col border-l z-20 shadow-xl">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 text-lg">Orden Actual</h2>
        {cart.length > 0 && (
          <button onClick={onClear} className="text-red-500 text-xs hover:underline font-medium">
            Vaciar
          </button>
        )}
      </div>

      {/* Lista de Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p>Carrito vacío</p>
          </div>
        )}

        {cart.map((item, idx) => (
          <div key={idx} className="bg-white rounded-lg border p-3 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-gray-800 text-sm">{item.productName}</div>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <div className="text-xs text-blue-600 mt-0.5">
                    + {item.selectedOptions.map(o => o.name).join(', ')}
                  </div>
                )}
                {item.comment && <div className="text-xs text-gray-500 italic">"{item.comment}"</div>}
              </div>
              <div className="font-bold text-gray-800 text-sm">
                {formatPrice(item.totalPrice)}
              </div>
            </div>

            {/* Controles de Cantidad (Sin botón Eliminar explícito) */}
            <div className="flex justify-end">
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 font-bold text-lg"
                  onClick={() => onDecrease(idx)}
                >
                  -
                </button>
                <div className="w-8 flex items-center justify-center font-semibold text-sm bg-white">
                  {item.quantity}
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-100 active:bg-green-200 font-bold text-lg"
                  onClick={() => onIncrease(idx)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
        </div>
        <button
          className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold text-lg shadow hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={onProcess}
          disabled={cart.length === 0}
        >
          Cobrar
        </button>
      </div>
    </aside>
  );
};

export default CartSidebar;