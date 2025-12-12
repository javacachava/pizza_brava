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
  // Lógica de visualización limpia:
  // Si hay combos, mostramos solo la sección de combos (asumiendo que estamos en la categoría Combos)
  // Si hay productos, mostramos productos.
  
  if (combos.length === 0 && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p>No se encontraron elementos.</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      
      {/* SECCIÓN DE COMBOS (Solo se renderiza si hay combos en la lista filtrada) */}
      {combos.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
            {combos.map(combo => (
              <ProductCard
                key={`combo-${combo.id}`}
                product={{
                  id: combo.id,
                  name: combo.name,
                  description: combo.description,
                  price: combo.price,
                  categoryId: 'combos',
                  isAvailable: combo.isAvailable,
                  usesIngredients: false,
                  usesFlavors: false,
                  usesSizeVariant: false,
                  comboEligible: false
                } as MenuItem}
                onClick={() => onComboClick(combo)}
              />
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN DE PRODUCTOS */}
      {products.length > 0 && (
        <div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {products.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onClick={() => onProductClick(p)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};