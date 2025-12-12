import React, { useState, useEffect } from 'react';
import type { ComboDefinition } from '../../../models/ComboDefinition';
import type { MenuItem } from '../../../models/MenuItem';
import type { OrderItem } from '../../../models/OrderItem';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../../utils/format';
import { generateId } from '../../../utils/id';

interface Props {
  combo: ComboDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comboItem: OrderItem) => void;
  products: MenuItem[];
}

export const ComboSelectionModal: React.FC<Props> = ({
  combo,
  isOpen,
  onClose,
  onConfirm,
  products
}) => {
  // Lógica simple: Si no permite elección, es "Fijo". Si permite, mostramos selects.
  // Por simplicidad en esta versión robusta, manejamos el caso "Fijo" visualmente limpio.
  
  if (!combo) return null;

  const handleConfirm = () => {
    // Aquí iría la lógica de recolección de items seleccionados
    const orderItem: OrderItem = {
      productId: null,
      productName: combo.name,
      quantity: 1,
      unitPrice: combo.price,
      totalPrice: combo.price,
      isCombo: true,
      combo: {
        id: generateId(),
        comboDefinitionId: combo.id,
        name: combo.name,
        price: combo.price,
        items: [] // Items internos
      },
      selectedOptions: []
    };
    onConfirm(orderItem);
  };

  const isCustomizable = combo.rules?.allowCustomChoice;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={combo.name}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-orange-600 text-white font-bold">
            Agregar {formatPrice(combo.price)}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 p-2">
        <p className="text-gray-600 text-lg text-center font-medium">
          {combo.description}
        </p>

        {isCustomizable ? (
          <div className="bg-yellow-50 p-4 rounded text-yellow-800 text-sm text-center">
            * Este combo permite selección de productos. 
            (Configuración simplificada activada)
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded text-green-800 text-sm flex items-center justify-center gap-2">
            ✅ <strong>Paquete Completo</strong> - Listo para agregar
          </div>
        )}
      </div>
    </Modal>
  );
};