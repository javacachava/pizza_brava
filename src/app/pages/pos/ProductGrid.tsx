import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition'; // <--- TIPO CORRECTO
import { ProductCard } from './ProductCard';

interface Props {
  products: MenuItem[];
  combos: ComboDefinition[]; // <--- TIPO CORRECTO
  onProductClick: (product: MenuItem) => void;
  onComboClick: (combo: ComboDefinition) => void; // <--- TIPO CORRECTO
}

export const ProductGrid: React.FC<Props> = ({ 
  products, 
  combos, 
  onProductClick, 
  onComboClick 
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 py-4">
      {/* Sección de Combos */}
      {combos.map(combo => (
        <ProductCard
          key={`combo-${combo.id}`}
          product={{
            id: combo.id,
            name: combo.name,
            description: combo.description, // Ahora existe en ComboDefinition
            price: combo.price,
            categoryId: 'combos', // Hardcoded o derivado de combo.categoryId
            isAvailable: combo.isAvailable,
            usesIngredients: false,
            usesFlavors: false,
            usesSizeVariant: false,
            comboEligible: false
          } as MenuItem} // Casting visual seguro
          onClick={() => onComboClick(combo)}
        />
      ))}

      {/* Sección de Productos */}
      {products.map(p => (
        <ProductCard 
          key={p.id} 
          product={p} 
          onClick={() => onProductClick(p)} 
        />
      ))}
    </div>
  );
};