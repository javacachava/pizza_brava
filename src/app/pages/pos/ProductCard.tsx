import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import { formatPrice } from '../../../utils/format';

interface Props {
  product: MenuItem;
  onClick: () => void;
}

export const ProductCard: React.FC<Props> = ({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-3 rounded-lg shadow-sm border hover:shadow-md cursor-pointer transition-all"
    >
      <div className="font-semibold text-sm mb-1">{product.name}</div>

      <div className="text-xs text-gray-600 mb-2">
        {product.description?.slice(0, 50) || ''}
      </div>

      <div className="font-bold text-lg text-orange-600">
        {formatPrice(product.price)}
      </div>
    </div>
  );
};
