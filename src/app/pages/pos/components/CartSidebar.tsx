import React, { useState } from 'react';
import { usePOS } from '../../../../contexts/POSContext';
import { CartItem } from './CartItem';
import { Button } from '../../../components/ui/Button';
import { OrderTypeModal } from './OrderTypeModal';

export const CartSidebar: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = usePOS();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    if (cart.length === 0) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', padding: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '3rem', marginBottom: '10px' }}>🛒</span>
                <p>Tu orden está vacía.</p>
                <p style={{ fontSize: '0.9rem' }}>Selecciona productos del menú.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                {cart.map((item, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #f0f0f0', backgroundColor: 'white', borderRadius: '6px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{item.productName}</span>
                                    <span style={{ fontWeight: 'bold' }}>${item.totalPrice.toFixed(2)}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#718096', margin: '4px 0' }}>
                                    {item.selectedOptions?.map(o => o.name).join(', ')}
                                </div>
                                {item.comment && <div style={{ fontSize: '0.8rem', color: '#e53e3e', fontStyle: 'italic' }}>"{item.comment}"</div>}
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                    <button 
                                        onClick={() => updateQuantity(index, -1)}
                                        style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e0', background: 'white', cursor: 'pointer' }}
                                    >-</button>
                                    <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(index, 1)}
                                        style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e0', background: 'white', cursor: 'pointer' }}
                                    >+</button>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeFromCart(index)}
                                style={{ background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', marginLeft: '10px', alignSelf: 'flex-start', fontSize: '1.2rem' }}
                                title="Eliminar"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{ marginTop: 'auto', borderTop: '2px dashed #e2e8f0', paddingTop: '15px', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px 8px 0 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                    <Button variant="danger" onClick={clearCart} style={{ fontSize: '0.9rem' }}>🗑️ Cancelar</Button>
                    <Button variant="primary" onClick={() => setIsCheckoutOpen(true)} style={{ fontSize: '1.1rem' }}>✅ COBRAR</Button>
                </div>
            </div>

            <OrderTypeModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </div>
    );
};