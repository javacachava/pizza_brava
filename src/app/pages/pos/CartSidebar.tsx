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
    // CAMBIO IMPORTANTE: Quitamos 'fixed' y usamos 'flex' para diseño responsivo
    // Se adapta al contenedor padre en POSPage.
    // Aplicamos tema oscuro (bg-[#161616], border-[#2A2A2A], textos claros)
    <aside className="
      hidden md:flex flex-col h-full 
      w-[280px] lg:w-[350px] 
      bg-[#161616] border-l border-[#2A2A2A] 
      shadow-2xl z-30 relative
    ">
      {/* Header */}
      <div className="p-5 border-b border-[#2A2A2A] bg-[#161616] z-10 flex justify-between items-center">
        <h2 className="font-bold text-white text-lg flex items-center gap-2">
           <span>🛒</span> Orden Actual
        </h2>
        {cart.length > 0 && (
          <button onClick={onClear} className="text-red-400 text-xs hover:text-red-300 font-medium transition-colors">
            Vaciar
          </button>
        )}
      </div>

      {/* Lista de Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-[#333]">
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <p className="text-sm">El carrito está vacío</p>
          </div>
        )}

        {cart.map((item, idx) => (
          <div key={idx} className="bg-[#1E1E1E] rounded-xl border border-[#333] p-3 shadow-md flex flex-col gap-2 group hover:border-[#FF5722]/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-gray-200 text-sm leading-tight">{item.productName}</div>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <div className="text-xs text-[#FF5722] mt-1 font-medium">
                    + {item.selectedOptions.map(o => o.name).join(', ')}
                  </div>
                )}
                {item.comment && <div className="text-xs text-gray-500 italic mt-1">"{item.comment}"</div>}
              </div>
              <div className="font-bold text-white text-sm whitespace-nowrap ml-2">
                {formatPrice(item.totalPrice)}
              </div>
            </div>

            {/* Controles de Cantidad */}
            <div className="flex justify-end mt-2">
              <div className="flex items-center bg-[#2A2A2A] rounded-lg overflow-hidden border border-[#333]">
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-[#333] hover:text-white active:bg-black transition-colors font-bold"
                  onClick={() => onDecrease(idx)}
                >
                  -
                </button>
                <div className="w-8 flex items-center justify-center font-bold text-sm text-white bg-[#2A2A2A]">
                  {item.quantity}
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center text-[#FF5722] hover:bg-[#FF5722]/10 hover:text-[#FF8A65] active:bg-[#FF5722]/20 transition-colors font-bold"
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
      <div className="p-5 border-t border-[#2A2A2A] bg-[#121212] z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400 font-medium">Total</span>
          <span className="text-2xl font-bold text-[#FF5722]">{formatPrice(total)}</span>
        </div>
        <button
          className="w-full py-4 bg-[#FF5722] text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-900/20 hover:bg-[#E64A19] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          onClick={onProcess}
          disabled={cart.length === 0}
        >
          Procesar Orden
        </button>
      </div>
    </aside>
  );
};

export default CartSidebar;