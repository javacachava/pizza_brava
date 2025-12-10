import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { usePOS } from '../../../../hooks/usePOS'; // <--- IMPORTACIÓN CORREGIDA

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const OrderTypeModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { placeOrder, total, isProcessing } = usePOS();
    
    const [step, setStep] = useState<'type' | 'details'>('type');
    const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
    
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
        if (!customerName.trim()) return alert("Nombre obligatorio");
        if (orderType === 'delivery' && (!phone || !address)) return alert("Teléfono y Dirección obligatorios para domicilio");
        if (orderType === 'dine-in' && !tableNumber) return alert("Número de mesa obligatorio");

        try {
            // Concatenamos datos para display simple
            let finalName = customerName;
            if (orderType === 'delivery') finalName += ` | 📞 ${phone} | 📍 ${address}`;
            else if (orderType === 'takeaway' && phone) finalName += ` | 📞 ${phone}`;

            await placeOrder(finalName, orderType, { tableNumber });
            alert("Orden enviada exitosamente");
            reset();
        } catch (error) {
            alert("Error procesando la orden");
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={reset} 
            title={step === 'type' ? "Selecciona Tipo de Pedido" : "Detalles del Cliente"}
        >
            {step === 'type' ? (
                <div className="grid gap-4 py-4">
                    <button 
                        onClick={() => handleTypeSelect('dine-in')}
                        className="flex items-center p-6 border-2 border-slate-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
                    >
                        <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">🍽️</span>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800">Comer en Mesa</h3>
                            <p className="text-sm text-slate-500">Servicio tradicional</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleTypeSelect('takeaway')}
                        className="flex items-center p-6 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                        <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">👜</span>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800">Para Llevar</h3>
                            <p className="text-sm text-slate-500">Recoger en mostrador</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleTypeSelect('delivery')}
                        className="flex items-center p-6 border-2 border-slate-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                    >
                        <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">🛵</span>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800">Domicilio</h3>
                            <p className="text-sm text-slate-500">Pedido telefónico</p>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4 py-2">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Cliente *</label>
                        <input className="input-field" autoFocus value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Ej: Juan Pérez" />
                    </div>

                    {orderType === 'dine-in' && (
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Número de Mesa *</label>
                            <input className="input-field" type="number" value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="Ej: 5" />
                        </div>
                    )}

                    {(orderType === 'delivery' || orderType === 'takeaway') && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono {orderType === 'delivery' && '*'}</label>
                            <input className="input-field" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej: 7777-7777" />
                        </div>
                    )}

                    {orderType === 'delivery' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Dirección Exacta *</label>
                            <textarea className="input-field h-24 resize-none" value={address} onChange={e => setAddress(e.target.value)} placeholder="Colonia, Calle, # Casa..." />
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-lg font-bold text-slate-800">
                            Total: <span className="text-orange-600">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={() => setStep('type')} disabled={isProcessing}>Atrás</Button>
                            <Button variant="primary" onClick={handleConfirm} isLoading={isProcessing}>
                                Confirmar Orden
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};