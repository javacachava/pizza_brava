import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { Table } from '../../../models/Table';
import confetti from 'canvas-confetti'; 

// Iconos (Usamos emoji por simplicidad o puedes sustituir por react-icons)
const ICONS = {
  EAT_IN: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  ),
  TAKEOUT: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
  ),
  DELIVERY: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> // Rayo/Moto representativo
  )
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: 'comer_aqui' | 'llevar' | 'pedido', meta?: any) => void;
  isLoading?: boolean;
  tables: Table[];
}

export const OrderTypeModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, isLoading, tables }) => {
  const [selectedType, setSelectedType] = useState<'comer_aqui' | 'llevar' | 'pedido' | null>(null);
  
  // Estados de Formulario
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Estado de Errores (para validación visual)
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Limpiar al cerrar/abrir
  useEffect(() => {
    if (isOpen) {
      setSelectedType(null);
      setSelectedTableId('');
      setCustomerName('');
      setPhone('');
      setAddress('');
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    if (selectedType === 'comer_aqui') {
      if (!selectedTableId) { newErrors.table = true; isValid = false; }
    } 
    
    if (selectedType === 'llevar') {
      if (!customerName.trim()) { newErrors.name = true; isValid = false; }
    }

    if (selectedType === 'pedido') { // Delivery
      if (!customerName.trim()) { newErrors.name = true; isValid = false; }
      if (!phone.trim()) { newErrors.phone = true; isValid = false; }
      if (!address.trim()) { newErrors.address = true; isValid = false; }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = () => {
    if (!selectedType) return;
    if (!validate()) return; // Detener si hay errores

    // Datos meta
    const meta: any = {};
    if (selectedType === 'comer_aqui') meta.tableId = selectedTableId;
    
    if (selectedType === 'llevar' || selectedType === 'pedido') {
      meta.customerName = customerName;
      meta.phone = phone; // Guardamos teléfono aunque sea opcional en 'llevar'
    }
    
    if (selectedType === 'pedido') {
      meta.address = address; // Dirección obligatoria para delivery
    }

    // --- EFECTO WOW: Confeti ---
    const colors = ['#FF5722', '#FF9800', '#ffffff'];
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
      colors: colors,
      disableForReducedMotion: true
    });
    // ---------------------------

    onConfirm(selectedType, meta);
    onClose();
  };

  // Renderizado de Inputs Reutilizable
  const renderInput = (
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    placeholder: string, 
    hasError: boolean,
    icon: React.ReactNode
  ) => (
    <div className="space-y-1.5 animate-fadeIn">
      <label className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#FF5722] transition-colors">
          {icon}
        </div>
        <input
          type="text"
          className={`
            w-full bg-[#161616] border text-white rounded-xl py-3 pl-10 pr-4 transition-all outline-none
            placeholder:text-gray-600
            ${hasError 
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
              : 'border-[#333] focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] hover:border-gray-600'}
          `}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            // Limpiar error al escribir
            if(hasError) setErrors(prev => ({...prev, [label.toLowerCase()]: false})); 
          }}
        />
      </div>
      {hasError && <p className="text-red-500 text-xs ml-1 font-medium">Este campo es obligatorio</p>}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tipo de Orden">
      <div className="flex flex-col h-full md:h-auto gap-6 p-1">
        
        {/* SELECCIÓN DE TIPO (Tarjetas Grandes) */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[
            { id: 'comer_aqui', label: 'Comer Aquí', icon: '🍽️' },
            { id: 'llevar', label: 'Para Llevar', icon: '🛍️' },
            { id: 'pedido', label: 'Delivery', icon: '🛵' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => { setSelectedType(type.id as any); setErrors({}); }}
              className={`
                flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200
                ${selectedType === type.id 
                  ? 'border-[#FF5722] bg-[#FF5722]/10 text-white shadow-[0_0_20px_rgba(255,87,34,0.15)]' 
                  : 'border-[#2A2A2A] bg-[#1E1E1E] text-gray-500 hover:border-gray-600 hover:bg-[#252525]'}
              `}
            >
              <span className={`text-3xl filter ${selectedType === type.id ? 'grayscale-0' : 'grayscale opacity-70'}`}>
                {type.icon}
              </span>
              <span className="font-bold text-xs md:text-sm">{type.label}</span>
            </button>
          ))}
        </div>

        {/* ÁREA DE FORMULARIO DINÁMICO */}
        <div className="bg-[#1E1E1E] rounded-2xl p-5 border border-[#2A2A2A] min-h-[200px]">
          
          {!selectedType && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2 py-8">
              <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-medium">Selecciona un tipo de orden arriba</p>
            </div>
          )}

          {/* CASO 1: COMER AQUÍ -> Solo Mesas */}
          {selectedType === 'comer_aqui' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-bold flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#FF5722] rounded-full"/>
                  Selecciona una Mesa
                </label>
                {errors.table && <span className="text-red-500 text-xs font-bold animate-pulse">¡Selecciona una!</span>}
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#333] pr-1">
                {tables.map(table => (
                  <button
                    key={table.id}
                    onClick={() => { setSelectedTableId(table.id); setErrors(prev => ({...prev, table: false})); }}
                    disabled={table.status === 'ocupada'}
                    className={`
                      relative p-3 rounded-xl border text-sm font-bold transition-all
                      ${selectedTableId === table.id 
                        ? 'bg-[#FF5722] border-[#FF5722] text-white shadow-lg scale-[1.02]' 
                        : table.status === 'ocupada'
                          ? 'bg-[#251010] border-red-900/30 text-red-700 cursor-not-allowed'
                          : 'bg-[#121212] border-[#333] text-gray-400 hover:border-gray-500 hover:text-gray-200'}
                    `}
                  >
                    {table.name}
                    {table.status === 'ocupada' && <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"/>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CASO 2: DELIVERY O LLEVAR */}
          {(selectedType === 'llevar' || selectedType === 'pedido') && (
            <div className="space-y-4 animate-fadeIn">
              {/* Nombre (Siempre) */}
              {renderInput(
                "Nombre del Cliente", 
                customerName, 
                setCustomerName, 
                "Ej. Juan Pérez", 
                errors.name,
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              )}

              {/* Teléfono (Opcional en Llevar, Obligatorio en Delivery) */}
              {renderInput(
                selectedType === 'pedido' ? "Teléfono (Obligatorio)" : "Teléfono (Opcional)", 
                phone, 
                setPhone, 
                "Ej. 7777-7777", 
                errors.phone && selectedType === 'pedido',
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              )}

              {/* Dirección (SOLO en Delivery) */}
              {selectedType === 'pedido' && renderInput(
                "Dirección de Entrega", 
                address, 
                setAddress, 
                "Ej. Col. Escalon, Psj. Las Rosas #123", 
                errors.address,
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </div>
          )}
        </div>

        {/* ACCIONES */}
        <div className="flex gap-3 pt-2">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1 py-4 bg-[#2A2A2A] hover:bg-[#333] text-gray-300 border-transparent rounded-xl font-bold"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            loading={isLoading} 
            disabled={!selectedType}
            className={`
              flex-1 py-4 rounded-xl font-bold text-white shadow-lg transition-all
              ${!selectedType 
                ? 'bg-[#2A2A2A] text-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-[#FF5722] hover:bg-[#E64A19] shadow-orange-900/30 active:scale-[0.98]'}
            `}
          >
            {isLoading ? 'Procesando...' : 'Confirmar Orden'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};