import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition';
// import { ProductCard } from './ProductCard'; // Opcional, o lo definimos inline si queremos mantener el estilo previo

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
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
      
      {/* SECCIÓN COMBOS */}
      {combos.map((c) => (
        <button
          key={c.id}
          onClick={() => onComboClick(c)}
          className="group bg-[#1E1E1E] rounded-2xl border border-[#333] hover:border-[#FF5722] transition-all duration-300 overflow-hidden text-left flex flex-col h-64"
        >
          <div className="h-40 bg-[#252525] relative flex items-center justify-center text-5xl">
            🎁
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-gray-100 mb-1">{c.name}</h3>
            <span className="text-xl font-bold text-[#FF5722]">${c.price.toFixed(2)}</span>
          </div>
        </button>
      ))}

      {/* SECCIÓN PRODUCTOS */}
      {products.map((p) => (
        <button 
          key={p.id}
          onClick={() => onProductClick(p)}
          className="group bg-[#1E1E1E] rounded-2xl border border-[#333] hover:border-[#FF5722] hover:shadow-xl hover:shadow-orange-900/10 transition-all duration-300 overflow-hidden text-left flex flex-col h-64"
        >
          <div className="h-40 bg-[#252525] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent opacity-60 z-10"/>
            <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500 text-gray-700">
              🍔
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-gray-100 text-lg leading-tight mb-1 group-hover:text-[#FF5722] transition-colors">{p.name}</h3>
            <div className="mt-auto flex justify-between items-center">
              <span className="text-xl font-bold text-white">${p.price.toFixed(2)}</span>
              <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-[#FF5722] group-hover:bg-[#FF5722] group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

// Exportamos por defecto y también como nombre (por si acaso importación es named)
export default ProductGrid;