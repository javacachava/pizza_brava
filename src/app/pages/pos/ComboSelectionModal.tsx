import React from 'react';
import type { ComboDefinition } from '../../../models/ComboDefinition';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { validateCombo } from '../../../utils/combo';

interface Props {
  definition: ComboDefinition | null;
  menu: Record<string, string>; // productId -> productName
  onClose: () => void;
  onConfirm: (selections: Record<string, string[]>) => void;
}

export const ComboSelectionModal: React.FC<Props> = ({
  definition,
  menu,
  onClose,
  onConfirm
}) => {
  const [selected, setSelected] = React.useState<Record<string, string[]>>({});

  if (!definition) return null;

  const toggleSelect = (slotId: string, productId: string) => {
    setSelected(prev => {
      const exists = prev[slotId]?.includes(productId);
      const updated = exists
        ? prev[slotId].filter(id => id !== productId)
        : [...(prev[slotId] || []), productId];
      return { ...prev, [slotId]: updated };
    });
  };

  const handleConfirm = () => {
    const validation = validateCombo(definition, selected);
    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }
    onConfirm(selected);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Seleccionar: ${definition.name}`}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {definition.slots?.map(slot => (
          <div key={slot.id} className="border p-3 rounded-md">
            <h3 className="font-semibold mb-2">{slot.name}</h3>

            {(slot.allowedProductIds || []).map(pid => (
              <label
                key={pid}
                className="flex items-center gap-2 mb-2 cursor-pointer"
              >
                <input
                  type={slot.max === 1 ? 'radio' : 'checkbox'}
                  name={slot.id}
                  checked={selected[slot.id]?.includes(pid) || false}
                  onChange={() => toggleSelect(slot.id, pid)}
                />
                {menu[pid]}
              </label>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
};
