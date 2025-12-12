import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition';
import { ProductCard } from './ProductCard';

interface Props {
  products: MenuItem[];
  combos: ComboDefinition[];
  onProductClick: (product: MenuItem) => void;
  onComboClick: (combo: ComboDefinition) => void;
}

export const ProductGrid: React.FC<Props> = ({ 
  products, 
  combos, 
  onProductClick, 
  onComboClick 
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 pb-20">
      {/* 1. Renderizar Combos (Prioridad Visual) */}
      {combos.map(combo => (
        <ProductCard
          key={`combo-${combo.id}`}
          product={{
            // Adaptador visual: Convertimos ComboDefinition a la estructura que ProductCard espera
            id: combo.id,
            name: combo.name,
            description: combo.description,
            price: combo.price, // Ahora existe en el modelo
            categoryId: 'combos',
            isAvailable: combo.isAvailable, // Ahora existe en el modelo
            
            // Flags por defecto para combos
            usesIngredients: false,
            usesFlavors: false,
            usesSizeVariant: false,
            comboEligible: false
          } as MenuItem}
          onClick={() => onComboClick(combo)}
          // Opcional: Podrías pasar un flag 'isCombo' si modificas ProductCard para estilos especiales
        />
      ))}

      {/* 2. Renderizar Productos Individuales */}
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