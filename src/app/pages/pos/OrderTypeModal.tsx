import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { Table } from '../../../models/Table';
import confetti from 'canvas-confetti'; 

// Iconos SVG Inline para no depender de librerías externas si no quieres
const Icons = {
  EatIn: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Takeout: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  Delivery: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Phone: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Map: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  
  // Formulario Delivery/Llevar
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Validación
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Reset al abrir
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

  // Filtrar mesas reales (Excluir Barra, Delivery, Llevar si existen como "mesas" en BD)
  const physicalTables = tables.filter(t => {
    const name = t.name.toLowerCase();
    return !name.includes('delivery') && !name.includes('llevar') && !name.includes('barra');
  });

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    if (selectedType === 'comer_aqui' && !selectedTableId) {
      newErrors.table = true; isValid = false;
    } 
    
    if (selectedType === 'llevar' && !customerName.trim()) {
      newErrors.name = true; isValid = false;
    }

    if (selectedType === 'pedido') { // Delivery estricto
      if (!customerName.trim()) { newErrors.name = true; isValid = false; }
      if (!phone.trim()) { newErrors.phone = true; isValid = false; }
      if (!address.trim()) { newErrors.address = true; isValid = false; }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = () => {
    if (!selectedType) return;
    if (!validate()) return;

    const meta: any = {};
    if (selectedType === 'comer_aqui') meta.tableId = selectedTableId;
    
    if (selectedType === 'llevar' || selectedType === 'pedido') {
      meta.customerName = customerName;
      meta.phone = phone;
    }
    
    if (selectedType === 'pedido') {
      meta.address = address;
    }

    // Efecto Confeti
    const colors = ['#FF5722', '#FF9800', '#ffffff'];
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors });

    onConfirm(selectedType, meta);
    onClose();
  };

  const renderInput = (
    field: string,
    label: string, 
    val: string, 
    setVal: (v: string) => void, 
    icon: React.ReactNode, 
    placeholder: string
  ) => {
    const hasError = errors[field];
    return (
      <div className="space-y-1.5 animate-fadeIn">
        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">{label}</label>
        <div className="relative group">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${hasError ? 'text-red-500' : 'text-gray-500 group-focus-within:text-[#FF5722]'}`}>
            {icon}
          </div>
          <input
            type="text"
            className={`
              w-full bg-[#121212] border rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-700 outline-none transition-all
              ${hasError 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' 
                : 'border-[#333] focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] hover:border-gray-600'}
            `}
            placeholder={placeholder}
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              if (hasError) setErrors(prev => ({ ...prev, [field]: false }));
            }}
          />
        </div>
        {hasError && <p className="text-red-500 text-[10px] font-bold ml-1">Campo requerido</p>}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tipo de Orden">
      <div className="flex flex-col gap-6">
        
        {/* SELECTOR TIPO */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'comer_aqui', label: 'Mesa', icon: <Icons.EatIn /> },
            { id: 'llevar', label: 'Llevar', icon: <Icons.Takeout /> },
            { id: 'pedido', label: 'Delivery', icon: <Icons.Delivery /> }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setSelectedType(opt.id as any); setErrors({}); }}
              className={`
                flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                ${selectedType === opt.id 
                  ? 'border-[#FF5722] bg-[#FF5722]/10 text-white shadow-lg shadow-orange-900/20 scale-[1.02]' 
                  : 'border-[#2A2A2A] bg-[#121212] text-gray-500 hover:border-gray-600 hover:text-gray-300'}
              `}
            >
              <div className={selectedType === opt.id ? 'text-[#FF5722]' : ''}>{opt.icon}</div>
              <span className="font-bold text-xs">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENIDO DINÁMICO */}
        <div className="min-h-[220px]">
          {!selectedType && (
            <div className="h-full flex flex-col items-center justify-center text-gray-700 py-10 gap-3 border border-dashed border-[#333] rounded-xl">
              <span className="text-4xl opacity-20">👈</span>
              <p className="text-sm font-medium">Selecciona una opción</p>
            </div>
          )}

          {/* MESAS */}
          {selectedType === 'comer_aqui' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-gray-300 text-sm font-bold">Mesas Disponibles</h4>
                {errors.table && <span className="text-red-500 text-xs font-bold animate-pulse">Selecciona una</span>}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#333]">
                {physicalTables.map(table => (
                  <button
                    key={table.id}
                    onClick={() => { setSelectedTableId(table.id); setErrors(p => ({...p, table: false})); }}
                    disabled={table.status === 'ocupada'}
                    className={`
                      p-3 rounded-xl border text-sm font-bold transition-all relative
                      ${selectedTableId === table.id 
                        ? 'bg-[#FF5722] border-[#FF5722] text-white' 
                        : table.status === 'ocupada'
                          ? 'bg-[#2A1515] border-red-900/30 text-red-500/50 cursor-not-allowed'
                          : 'bg-[#121212] border-[#333] text-gray-400 hover:border-gray-500 hover:text-white'}
                    `}
                  >
                    {table.name}
                    {table.status === 'ocupada' && <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"/>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DELIVERY / LLEVAR */}
          {(selectedType === 'llevar' || selectedType === 'pedido') && (
            <div className="space-y-4 animate-fadeIn">
              {renderInput('name', 'Cliente', customerName, setCustomerName, <Icons.User />, 'Nombre completo')}
              
              {renderInput('phone', 'Teléfono', phone, setPhone, <Icons.Phone />, selectedType === 'pedido' ? 'Requerido para delivery' : 'Opcional')}
              
              {selectedType === 'pedido' && (
                renderInput('address', 'Dirección', address, setAddress, <Icons.Map />, 'Dirección de entrega')
              )}
            </div>
          )}
        </div>

        {/* BOTONES ACCIÓN */}
        <div className="flex gap-3 pt-4 border-t border-[#2A2A2A]">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1 bg-[#121212] hover:bg-[#222] text-gray-400 border border-[#333]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            loading={isLoading} 
            disabled={!selectedType}
            className={`
              flex-1 font-bold text-white shadow-lg transition-all
              ${!selectedType 
                ? 'bg-[#222] text-gray-600 cursor-not-allowed' 
                : 'bg-[#FF5722] hover:bg-[#E64A19] shadow-orange-900/30 active:scale-[0.98]'}
            `}
          >
            {isLoading ? 'Procesando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};