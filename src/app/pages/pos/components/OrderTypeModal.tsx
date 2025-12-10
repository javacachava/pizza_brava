import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { usePOS } from '../../../../contexts/POSContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const OrderTypeModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { placeOrder, total, isProcessing } = usePOS();
    
    const [step, setStep] = useState<'type' | 'details'>('type');
    const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
    
    // Formulario
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [tableNumber, setTableNumber] = useState('');

    const reset = () => {
        setStep('type');
        setCustomerName('');
        setPhone('');
        setAddress('');
        setTableNumber('');
        onClose();
    };

    const handleTypeSelect = (type: 'dine-in' | 'takeaway' | 'delivery') => {
        setOrderType(type);
        setStep('details');
    };

    const handleConfirm = async () => {
        // --- REGLAS DE NEGOCIO Y VALIDACIÓN ---
        
        // 1. Nombre casi siempre requerido para tracking, salvo quizá dine-in rápido
        if (!customerName.trim()) {
            alert("Por favor ingresa el nombre del cliente.");
            return;
        }

        // 2. Regla: Domicilio exige Teléfono y Dirección
        if (orderType === 'delivery') {
            if (!phone.trim() || !address.trim()) {
                alert("Para Domicilio, el Teléfono y la Dirección son OBLIGATORIOS.");
                return;
            }
        }

        // 3. Regla: Mesa exige número de mesa
        if (orderType === 'dine-in' && !tableNumber.trim()) {
            alert("Por favor ingresa el número de mesa.");
            return;
        }

        try {
            // Concatenamos datos sensibles al nombre/notas si el modelo Order no tiene campos específicos aún
            // O los pasamos al servicio si este lo soporta.
            // Asumimos que POSService maneja 'tableNumber'.
            // Para phone/address, los adjuntamos al nombre del cliente para visualización simple en Ticket,
            // PERO recordamos que en Cocina esto debe filtrarse (ya implementado en KitchenOrderCard).
            
            let finalCustomerName = customerName;
            if (orderType === 'delivery') {
                finalCustomerName = `${customerName} | 📞 ${phone} | 📍 ${address}`;
            } else if (orderType === 'takeaway' && phone) {
                finalCustomerName = `${customerName} | 📞 ${phone}`;
            }

            await placeOrder(finalCustomerName, orderType, { tableNumber });
            
            alert("¡Orden enviada a cocina!");
            reset();
        } catch (error) {
            alert("Error al guardar la orden. Intente nuevamente.");
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={reset} 
            title={step === 'type' ? "Tipo de Pedido" : `Detalles: ${orderType.toUpperCase()}`}
        >
            {step === 'type' ? (
                <div style={{ display: 'grid', gap: '15px' }}>
                    <Button variant="outline" style={{ height: '70px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={() => handleTypeSelect('dine-in')}>
                        🍽️ Comer Aquí (Mesa)
                    </Button>
                    <Button variant="outline" style={{ height: '70px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={() => handleTypeSelect('takeaway')}>
                        👜 Para Llevar
                    </Button>
                    <Button variant="outline" style={{ height: '70px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={() => handleTypeSelect('delivery')}>
                        🛵 Domicilio / Teléfono
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 'bold'}}>Nombre del Cliente *</label>
                        <input className="input-field" autoFocus type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ width: '100%', padding: '10px' }} />
                    </div>

                    {orderType === 'dine-in' && (
                         <div>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 'bold'}}>Número de Mesa *</label>
                            <input className="input-field" type="text" value={tableNumber} onChange={e => setTableNumber(e.target.value)} style={{ width: '100%', padding: '10px' }} />
                        </div>
                    )}

                    {(orderType === 'delivery' || orderType === 'takeaway') && (
                        <div>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 'bold'}}>Teléfono {orderType === 'delivery' && '*'}</label>
                            <input className="input-field" type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '10px' }} />
                        </div>
                    )}

                    {orderType === 'delivery' && (
                        <div>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 'bold'}}>Dirección Exacta *</label>
                            <textarea value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '10px', height: '80px', borderRadius: '6px', borderColor: '#cbd5e0' }} placeholder="Colonia, # Casa, Referencia..." />
                        </div>
                    )}

                    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <div style={{ fontSize: '1.2rem', textAlign: 'right', marginBottom: '15px' }}>
                            Total a Cobrar: <strong>${total.toFixed(2)}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button variant="secondary" onClick={() => setStep('type')} disabled={isProcessing}>Atrás</Button>
                            <Button variant="primary" style={{ flex: 1 }} onClick={handleConfirm} disabled={isProcessing}>
                                {isProcessing ? 'Procesando...' : 'CONFIRMAR ORDEN'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};