import React from 'react';
import type { OrderItem } from '../../../models/OrderItem';
import { formatPrice } from '../../../utils/format';

interface Props {
  item: OrderItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItem: React.FC<Props> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove
}) => {
  return (
    <div className="flex justify-between items-center border-b py-3">
      <div>
        <div className="font-semibold text-sm">{item.productName}</div>
        <div className="text-xs text-gray-600">{formatPrice(item.unitPrice)}</div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onDecrease} className="px-2">-</button>
        <span>{item.quantity}</span>
        <button onClick={onIncrease} className="px-2">+</button>

        <div className="font-semibold">{formatPrice(item.totalPrice)}</div>

        <button onClick={onRemove} className="text-red-600 text-xs ml-2">
          Eliminar
        </button>
      </div>
    </div>
  );
};
