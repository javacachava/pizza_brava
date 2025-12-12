import React from 'react';
import type { ComboDefinition } from '../../../models/ComboDefinition'; // <--- USAR DEFINICIÓN
import type { OrderItem } from '../../../models/OrderItem';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../../utils/format';

interface Props {
  combo: ComboDefinition | null; // <--- TIPO CORRECTO: Aquí viene la descripción
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comboItem: OrderItem) => void;
}

export const ComboSelectionModal: React.FC<Props> = ({
  combo,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!combo) return null;

  const handleConfirm = () => {
    // Convertimos la Definición (catálogo) en un Item de Orden (carrito)
    const orderItem: OrderItem = {
      productId: null, 
      productName: combo.name,
      quantity: 1,
      unitPrice: combo.price,
      totalPrice: combo.price,
      isCombo: true,
      // Guardamos referencia a la definición si el modelo lo permite, 
      // o adaptamos según tu interface OrderItem
      combo: {
          id: `inst_${Date.now()}`, // ID temporal de instancia
          comboDefinitionId: combo.id,
          name: combo.name,
          price: combo.price,
          items: [] // Aquí irían los items seleccionados
      }, 
      selectedOptions: []
    };

    onConfirm(orderItem);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Combo: ${combo.name}`}
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-orange-600 text-white">
            Confirmar {formatPrice(combo.price)}
          </Button>
        </div>
      }
    >
      <div className="p-2 space-y-4">
        {/* Ahora combo.description SI existe porque es ComboDefinition */}
        <p className="text-gray-600">{combo.description}</p> 
        
        <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
          ℹ️ Configuración rápida. (Reglas: {combo.rules?.maxPizzas || 0} pizzas)
        </div>
      </div>
    </Modal>
  );
};