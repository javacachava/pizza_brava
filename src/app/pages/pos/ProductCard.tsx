import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition';

interface Props {
  item: MenuItem | ComboDefinition;
  type: 'PRODUCT' | 'COMBO';
  onClick: () => void;
}

export const ProductCard: React.FC<Props> = ({ item, type, onClick }) => {
  const isCombo = type === 'COMBO';
  
  // Determinamos imagen o icono por defecto
  const renderImage = () => {
    // Si tuviera propiedad de imagen real:
    // if (item.image) return <img src={item.image} ... />
    
    return (
      <div className={`
        w-full h-full flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110
        ${isCombo ? 'text-orange-200' : 'text-gray-600'}
      `}>
        {isCombo ? '🎁' : '🍔'}
      </div>
    );
  };

  return (
    <button 
      onClick={onClick}
      className="
        group relative w-full h-64 flex flex-col text-left
        bg-[#1E1E1E] rounded-2xl border border-[#333] overflow-hidden
        transition-all duration-300
        hover:border-[#FF5722] hover:shadow-xl hover:shadow-[#FF5722]/10 hover:-translate-y-1
        active:scale-[0.98]
      "
    >
      {/* 1. Área de Imagen (Superior) */}
      <div className="h-36 w-full bg-[#252525] relative overflow-hidden">
        {/* Gradiente sutil para profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent opacity-40 z-10"/>
        
        {renderImage()}

        {/* Badge de Combo (Opcional) */}
        {isCombo && (
          <span className="absolute top-3 right-3 z-20 bg-[#FF5722] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
            COMBO
          </span>
        )}
      </div>

      {/* 2. Área de Contenido (Inferior) */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-gray-100 font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#FF5722] transition-colors">
            {item.name}
          </h3>
          {/* Descripción corta si existiera */}
          {/* <p className="text-gray-500 text-xs mt-1 line-clamp-1">{item.description}</p> */}
        </div>

        <div className="flex justify-between items-end mt-2">
          <span className="text-xl font-bold text-white tracking-tight">
            ${item.price.toFixed(2)}
          </span>
          
          {/* Botón visual de "Agregar" */}
          <div className="
            w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-[#FF5722]
            group-hover:bg-[#FF5722] group-hover:text-white transition-colors duration-300
          ">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
};