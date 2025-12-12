import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import type { Flavor } from '../../../models/Flavor'; // Importa tu modelo
import type { SelectedOption } from '../../../models/OrderItem';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../../utils/format';

interface Props {
  product: MenuItem | null;
  allFlavors: Flavor[]; // <--- Recibimos todos los sabores disponibles
  isOpen: boolean;
  onClose: () => void;
  // Callback actualizado para devolver opciones seleccionadas
  onConfirm: (product: MenuItem, quantity: number, notes: string, options: SelectedOption[]) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  allFlavors,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedFlavorId, setSelectedFlavorId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQty(1);
      setNotes('');
      setSelectedFlavorId(null);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const handleConfirm = () => {
    // Validar sabor si es requerido
    if (product.usesFlavors && !selectedFlavorId) {
      alert("Por favor selecciona un sabor.");
      return;
    }

    const options: SelectedOption[] = [];
    
    // Si hay sabor seleccionado, lo agregamos como opción
    if (selectedFlavorId) {
      const flavor = allFlavors.find(f => f.id === selectedFlavorId);
      if (flavor) {
        options.push({
          id: flavor.id,
          name: flavor.name,
          price: 0 // Asumimos que el sabor no cambia el precio base por ahora
        });
      }
    }

    onConfirm(product, qty, notes, options);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-orange-600 text-white hover:bg-orange-700">
            Agregar {formatPrice(product.price * qty)}
          </Button>
        </div>
      }
    >
      <div className="space-y-5 p-2">
        <p className="text-gray-600 text-sm italic">
          {product.description || "Sin descripción"}
        </p>

        {/* --- SECCIÓN DE SABORES (Solo si aplica) --- */}
        {product.usesFlavors && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Selecciona Sabor:</h4>
            <div className="grid grid-cols-3 gap-2">
              {allFlavors.length === 0 && <span className="text-xs text-gray-500">No hay sabores cargados.</span>}
              {allFlavors.map(flavor => (
                <button
                  key={flavor.id}
                  onClick={() => setSelectedFlavorId(flavor.id)}
                  className={`
                    py-2 px-1 text-xs font-bold rounded border transition-all
                    ${selectedFlavorId === flavor.id 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }
                  `}
                >
                  {flavor.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- CANTIDAD --- */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
          <span className="font-semibold text-gray-700">Cantidad</span>
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 rounded-full bg-white border shadow-sm hover:bg-gray-100 font-bold text-xl"
              onClick={() => setQty(q => Math.max(1, q - 1))}
            >-</button>
            <span className="text-xl font-bold w-8 text-center">{qty}</span>
            <button 
              className="w-10 h-10 rounded-full bg-white border shadow-sm hover:bg-gray-100 font-bold text-xl"
              onClick={() => setQty(q => q + 1)}
            >+</button>
          </div>
        </div>

        {/* --- NOTAS --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <input
            className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Opcional..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};