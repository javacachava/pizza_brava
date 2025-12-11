import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../../utils/format';

interface Props {
  product: MenuItem | null;
  onClose: () => void;
  onAdd: (quantity: number) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  onClose,
  onAdd
}) => {
  const [qty, setQty] = React.useState(1);

  if (!product) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={product.name}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onAdd(qty)}>Agregar</Button>
        </div>
      }
    >
      <div>
        <p className="text-sm mb-4">{product.description}</p>

        <div className="flex items-center gap-3 mb-4">
          <Button onClick={() => setQty(q => Math.max(1, q - 1))}>-</Button>
          <span className="text-lg font-semibold">{qty}</span>
          <Button onClick={() => setQty(q => q + 1)}>+</Button>
        </div>

        <div className="font-bold text-lg text-orange-600">
          Total: {formatPrice(product.price * qty)}
        </div>
      </div>
    </Modal>
  );
};

