import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition';
import { CategoryThemeFactory } from '../../../utils/CategoryThemeFactory'; //

interface Props {
  item: MenuItem | ComboDefinition;
  type: 'PRODUCT' | 'COMBO';
  onClick: () => void;
}

export const ProductCard: React.FC<Props> = ({ item, type, onClick }) => {
  const isCombo = type === 'COMBO';
  
  // Determinamos el tema basado en el tipo o la categoría del ítem
  // Si es producto, usamos su categoryId, si es combo, forzamos 'combos'
  const categoryKey = isCombo ? 'combos' : (item as MenuItem).categoryId || 'all';
  const theme = CategoryThemeFactory.getTheme(String(categoryKey));

  const renderImage = () => {
    // Usamos el icono de la factoría si no hay imagen
    return (
      <div className={`
        w-full h-full flex items-center justify-center text-5xl md:text-6xl 
        text-white drop-shadow-lg transition-transform duration-500 group-hover:scale-110
      `}>
        {theme.icon}
      </div>
    );
  };

  return (
    <button 
      onClick={onClick}
      className={`
        group relative w-full flex flex-col text-left
        bg-[#1E1E1E] rounded-2xl border border-[#333] overflow-hidden
        transition-all duration-300
        hover:border-transparent hover:ring-2
        active:scale-[0.98]
        h-56 md:h-64 lg:h-72 shadow-lg hover:shadow-2xl
      `}
      // Aplicamos el color de acento al borde/ring en hover dinámicamente
      style={{ '--tw-ring-color': theme.accentColor } as React.CSSProperties}
    >
      {/* 1. Área de Imagen con Gradiente Dinámico */}
      <div className={`
        h-32 md:h-40 w-full relative overflow-hidden bg-gradient-to-br ${theme.gradient}
      `}>
        {/* Patrón o superposición suave */}
        <div className="absolute inset-0 bg-black/10 z-0" />
        
        <div className="relative z-10 w-full h-full">
            {renderImage()}
        </div>

        {/* Badge de Combo */}
        {isCombo && (
          <span className="absolute top-2 right-2 z-20 bg-white/90 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-sm">
            COMBO
          </span>
        )}
      </div>

      {/* 2. Área de Contenido */}
      <div className="flex-1 p-3 md:p-4 flex flex-col justify-between bg-[#1E1E1E]">
        <div>
          <h3 className="text-gray-100 font-bold text-sm md:text-base leading-tight line-clamp-2 group-hover:text-white transition-colors">
            {item.name}
          </h3>
        </div>

        <div className="flex justify-between items-end mt-2">
          <span className={`text-lg md:text-xl font-bold tracking-tight ${theme.accentColor}`}>
            ${item.price.toFixed(2)}
          </span>
          
          {/* Botón visual "+" */}
          <div className={`
            w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-gray-400
            group-hover:bg-white group-hover:text-black transition-colors duration-300 shadow-sm
          `}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
};