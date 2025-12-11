import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import { ProductCard } from './ProductCard';

interface Props {
  products: MenuItem[];
  onProductClick: (product: MenuItem) => void;
}

export const ProductGrid: React.FC<Props> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 py-4">
      {products.map(p => (
        <ProductCard key={p.id} product={p} onClick={() => onProductClick(p)} />
      ))}
    </div>
  );
};
