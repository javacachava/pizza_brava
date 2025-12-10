import React, { useState } from 'react';
import { usePOS } from '../../../../hooks/usePOS'; // <--- IMPORTACIÓN CORREGIDA
import { Button } from '../../../components/ui/Button';
import { OrderTypeModal } from './OrderTypeModal';

export const CartSidebar: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = usePOS();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    if (cart.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <span className="text-6xl mb-4 opacity-50">🛒</span>
                <p className="font-medium">Tu carrito está vacío</p>
                <p className="text-sm mt-1">Agrega productos del menú</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto p-2">
                {cart.map((item, index) => (
                    <div key={index} className="flex gap-3 p-3 mb-2 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-orange-200 transition-colors">
                        {/* Cantidad Control */}
                        <div className="flex flex-col items-center gap-1">
                            <button onClick={() => updateQuantity(index, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600 font-bold">+</button>
                            <span className="text-sm font-bold text-slate-800">{item.quantity}</span>
                            <button onClick={() => updateQuantity(index, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 font-bold">-</button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-slate-800 text-sm truncate pr-2">{item.productName}</span>
                                <span className="font-bold text-slate-900 text-sm">${item.totalPrice.toFixed(2)}</span>
                            </div>
                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                <div className="text-xs text-slate-500 mt-1">
                                    {item.selectedOptions.map(o => o.name).join(', ')}
                                </div>
                            )}
                            {item.comment && <div className="text-xs text-orange-600 italic mt-1">"{item.comment}"</div>}
                        </div>

                        {/* Eliminar */}
                        <button onClick={() => removeFromCart(index)} className="text-slate-300 hover:text-red-500 self-start p-1 transition-colors">
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-slate-500 font-medium">Total a pagar</span>
                    <span className="text-2xl font-bold text-slate-800">${total.toFixed(2)}</span>
                </div>
                
                <div className="grid grid-cols-[1fr_2fr] gap-3">
                    <Button variant="danger" onClick={clearCart} className="text-sm">
                        Vaciar
                    </Button>
                    <Button variant="primary" onClick={() => setIsCheckoutOpen(true)} className="text-base shadow-lg shadow-orange-500/20">
                        Cobrar
                    </Button>
                </div>
            </div>

            <OrderTypeModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </div>
    );
};