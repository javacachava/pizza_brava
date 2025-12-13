import React from 'react';
import type { MenuItem } from '../../../models/MenuItem';
import type { ComboDefinition } from '../../../models/ComboDefinition';
import { CategoryThemeFactory } from '../../../utils/CategoryThemeFactory';

interface Props {
  item: MenuItem | ComboDefinition;
  type: 'PRODUCT' | 'COMBO';
  onClick: () => void;
}

export const ProductCard: React.FC<Props> = ({ item, type, onClick }) => {
  const isCombo = type === 'COMBO';
  
  // Obtenemos el tema (colores e icono)
  const categoryKey = isCombo ? 'combos' : (item as MenuItem).categoryId || 'all';
  const theme = CategoryThemeFactory.getTheme(String(categoryKey));

  return (
    <button 
      onClick={onClick}
      className={`
        group relative w-full h-36 md:h-40 flex flex-col text-left
        bg-[#1E1E1E] rounded-2xl border border-[#333] overflow-hidden
        transition-all duration-300
        hover:border-transparent hover:ring-2 hover:shadow-2xl
        active:scale-[0.97]
      `}
      // El anillo de color al hacer hover tomará el color de la categoría
      style={{ '--tw-ring-color': theme.accentColor } as React.CSSProperties}
    >
      
      {/* 1. CAPA DE CONTENIDO (Texto y Precio) - Z-Index superior */}
      <div className="relative z-10 p-4 flex flex-col justify-between h-full w-full">
        
        {/* Header: Nombre y Badge Combo */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-2 pr-8 group-hover:text-white/90 transition-colors">
            {item.name}
          </h3>
          {isCombo && (
            <span className="flex-shrink-0 bg-[#FF5722] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
              Combo
            </span>
          )}
        </div>

        {/* Footer: Precio y Botón + */}
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Precio</span>
             <span className={`text-xl md:text-2xl font-bold tracking-tight ${theme.accentColor}`}>
               ${item.price.toFixed(2)}
             </span>
          </div>

          {/* Botón visual pequeño */}
          <div className={`
            w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-gray-400
            group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-md
          `}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. CAPA DECORATIVA (Icono Degradado Fondo) - Z-Index inferior */}
      {/* Usamos bg-clip-text con text-transparent para que el gradiente se aplique a la FORMA del icono.
          Lo rotamos y lo posicionamos "saliéndose" de la tarjeta para efecto artístico.
      */}
      <div className={`
        absolute -bottom-6 -right-6 
        text-9xl md:text-[8rem] 
        opacity-[0.15] group-hover:opacity-25 transition-opacity duration-500
        transform -rotate-12
        pointer-events-none z-0
      `}>
         {/* Envolvemos el icono en un span con gradiente de texto */}
         <span className={`bg-gradient-to-br ${theme.gradient} bg-clip-text text-transparent`}>
            {theme.icon}
         </span>
      </div>
      
      {/* Sutil gradiente oscuro en el fondo para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60 pointer-events-none z-0"/>
    </button>
  );
};