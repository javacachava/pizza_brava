import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition';
import { ProductCard } from './ProductCard';

interface Props {
  products: MenuItem[];
  combos: ComboDefinition[];
  onProductClick: (item: MenuItem) => void;
  onComboClick: (combo: ComboDefinition) => void;
}

export const ProductGrid: React.FC<Props> = ({ 
  products, 
  combos, 
  onProductClick, 
  onComboClick 
}) => {
  
  const hasItems = products.length > 0 || combos.length > 0;

  if (!hasItems) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-lg font-medium">No hay productos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
      
      {/* 1. Renderizamos Combos primero (Prioridad visual) */}
      {combos.map((combo) => (
        <ProductCard
          key={`combo-${combo.id}`}
          item={combo}
          type="COMBO"
          onClick={() => onComboClick(combo)}
        />
      ))}

      {/* 2. Renderizamos Productos individuales */}
      {products.map((product) => (
        <ProductCard
          key={`prod-${product.id}`}
          item={product}
          type="PRODUCT"
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;