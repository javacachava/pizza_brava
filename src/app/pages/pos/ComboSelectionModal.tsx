import React from 'react';
import type { ComboDefinition } from '../../../models/ComboDefinition';
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
}

export const ComboSelectionModal: React.FC<Props> = ({
  combo,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!combo) return null;

  const handleConfirm = () => {
    // Lógica de transformación: Definición -> OrderItem
    const orderItem: OrderItem = {
      productId: null, // Es un combo
      productName: combo.name,
      quantity: 1,
      unitPrice: combo.price, // Ahora TypeScript sabe que 'price' existe
      totalPrice: combo.price,
      isCombo: true,
      combo: {
        id: generateId(),
        comboDefinitionId: combo.id,
        name: combo.name,
        price: combo.price,
        items: [] // Aquí irían las selecciones reales si tuviéramos slots
      },
      selectedOptions: []
    };

    onConfirm(orderItem);
  };

  // Extraemos reglas para mostrar al usuario
  const { maxPizzas, maxDrinks, maxSides } = combo.rules || { maxPizzas: 0, maxDrinks: 0, maxSides: 0 };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Combo: ${combo.name}`}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-orange-600 hover:bg-orange-700 text-white font-bold">
            Agregar por {formatPrice(combo.price)}
          </Button>
        </div>
      }
    >
      <div className="p-2 space-y-4">
        {combo.description && (
          <p className="text-gray-600 italic border-l-4 border-orange-200 pl-3">
            {combo.description}
          </p>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="text-blue-900 font-semibold mb-2 flex items-center gap-2">
            ℹ️ Contenido del Combo
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 ml-1">
            {maxPizzas > 0 && <li>🍕 {maxPizzas} Pizza{maxPizzas > 1 ? 's' : ''}</li>}
            {maxDrinks > 0 && <li>🥤 {maxDrinks} Bebida{maxDrinks > 1 ? 's' : ''}</li>}
            {maxSides > 0 && <li>🍟 {maxSides} Acompañamiento{maxSides > 1 ? 's' : ''}</li>}
            {maxPizzas === 0 && maxDrinks === 0 && maxSides === 0 && <li>📦 Paquete predefinido</li>}
          </ul>
        </div>

        {/* Aquí renderizaríamos los selectores de slots en el futuro */}
        {combo.rules?.allowCustomChoice ? (
          <div className="text-xs text-gray-500 mt-2">
            * Este combo permite personalización (Selectores próximamente)
          </div>
        ) : (
          <div className="text-xs text-gray-500 mt-2">
            * Combo fijo
          </div>
        )}
      </div>
    </Modal>
  );
};