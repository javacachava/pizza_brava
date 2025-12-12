import React from 'react';
import type { OrderItem } from '../../../models/OrderItem';
import { formatPrice } from '../../../utils/format';

interface Props {
  cart: OrderItem[];
  onIncrease: (index: number) => void;
  onDecrease: (index: number) => void;
  onRemove: (index: number) => void;
  onClear: () => void;      // <--- Agregado para cumplir requerimiento de limpiar
  onProcess: () => void;    // <--- Renombrado para coincidir con POSPage
}

export const CartSidebar: React.FC<Props> = ({ 
  cart, 
  onIncrease, 
  onDecrease, 
  onRemove, 
  onClear,
  onProcess 
}) => {
  const total = cart.reduce((acc, it) => acc + (it.totalPrice ?? 0), 0);

  return (
    <aside className="w-80 fixed right-0 top-0 h-full bg-white p-4 shadow-xl overflow-auto flex flex-col z-20 border-l">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">Orden Actual</h2>
        <div className="flex items-center gap-2">
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-semibold">
            {cart.length} items
          </span>
          {cart.length > 0 && (
            <button 
              onClick={onClear} 
              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista de Items Scrollable */}
      <div className="flex-1 space-y-3 overflow-y-auto min-h-0 pr-1">
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 opacity-60">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span className="text-sm">Carrito vacío</span>
          </div>
        )}

        {cart.map((item, idx) => (
          <div key={`${item.productId || 'combo'}-${idx}`} className="flex flex-col bg-gray-50 rounded-lg p-3 border border-gray-100 relative group hover:border-orange-200 transition-colors">
            
            {/* Header del Item */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-2">
                <div className="font-semibold text-gray-800 text-sm leading-tight">{item.productName}</div>
                {item.isCombo && <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded inline-block mt-0.5">Combo</span>}
              </div>
              <div className="text-sm font-bold text-gray-700">
                {formatPrice(item.totalPrice)}
              </div>
            </div>

            {/* Opciones Seleccionadas */}
            {item.selectedOptions && item.selectedOptions.length > 0 && (
              <div className="text-xs text-gray-500 mb-2 pl-2 border-l-2 border-gray-200">
                {item.selectedOptions.map(o => o.name).join(', ')}
              </div>
            )}

            {/* Controles */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200/60">
              <button
                className="text-red-500 text-xs hover:underline hover:text-red-700 px-1"
                onClick={() => onRemove(idx)}
              >
                Eliminar
              </button>

              <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm h-8">
                <button
                  className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg active:bg-gray-200"
                  onClick={() => onDecrease(idx)}
                >
                  −
                </button>
                <div className="w-8 flex items-center justify-center font-semibold text-sm border-x border-gray-100">
                  {item.quantity}
                </div>
                <button
                  className="w-8 h-full flex items-center justify-center text-green-600 hover:bg-green-50 rounded-r-lg active:bg-green-100"
                  onClick={() => onIncrease(idx)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Totales y Acción */}
      <div className="mt-4 pt-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{formatPrice(total)}</div>
        </div>

        <button
          className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transform active:scale-[0.98] transition-all 
            ${cart.length === 0 
              ? 'bg-gray-300 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/30'
            }`}
          onClick={onProcess}
          disabled={cart.length === 0}
        >
          {cart.length === 0 ? 'Sin Productos' : 'Cobrar Orden'}
        </button>
      </div>
    </aside>
  );
};

export default CartSidebar;