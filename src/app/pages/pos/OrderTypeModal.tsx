import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { OrderType } from '../../../models/Order';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (type: OrderType) => void;
}

export const OrderTypeModal: React.FC<Props> = ({
  open,
  onClose,
  onSelect
}) => {
  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Tipo de Orden">
      <div className="flex flex-col gap-4">
        <Button onClick={() => onSelect('mesa')}>Para comer</Button>
        <Button onClick={() => onSelect('llevar')}>Para llevar</Button>
        <Button onClick={() => onSelect('pedido')}>Delivery</Button>
      </div>
    </Modal>
  );
};
