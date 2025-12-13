import React from 'react';
import { Product } from '@/models/ProductTypes';
import { useProductSelection } from '@/hooks/useProductSelection';
import { ComboSelector } from './ProductSelection/ComboSelector'; // (Código previo)
import { VariantSelector } from './ProductSelection/VariantSelector'; // (Código previo)
import { IngredientSelector } from './ProductSelection/IngredientSelector';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (item: any) => void;
}

export const ProductSelectionModal: React.FC<Props> = ({ isOpen, onClose, product, onAddToCart }) => {
  if (!isOpen || !product) return null;

  const logic = useProductSelection(product);

  const handleConfirm = () => {
    onAddToCart({
      product,
      finalPrice: logic.totalPrice,
      selectedVariants: logic.variantSelections,
      selectedCombo: logic.comboSelections,
      selectedIngredients: Array.from(logic.selectedIngredients)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-[#121212] w-full max-w-4xl h-[85vh] rounded-2xl flex overflow-hidden shadow-2xl border border-[#333]">
        
        {/* COLUMNA IZQUIERDA: FOTO Y RESUMEN */}
        <div className="w-1/3 bg-[#1E1E1E] hidden md:flex flex-col relative">
          <img src={product.image} className="w-full h-64 object-cover opacity-80" />
          <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{product.description}</p>
            <div className="mt-auto pt-6 border-t border-gray-700">
               <span className="text-gray-400 text-xs uppercase tracking-widest">Total</span>
               <div className="text-4xl font-bold text-[#FF5722]">${logic.totalPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: OPCIONES */}
        <div className="flex-1 flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-[#333]">
            <h3 className="text-white font-bold md:hidden">{product.name}</h3> {/* Movil title */}
            <button onClick={onClose} className="text-gray-400 hover:text-white bg-[#2A2A2A] rounded-full p-2">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* RENDERIZADO CONDICIONAL SEGÚN MOTOR */}
            
            {/* 1. MOTOR COMBOS */}
            {product.behavior === 'COMBO_PACK' && product.comboConfig && (
              <ComboSelector 
                slots={product.comboConfig.slots} 
                selections={logic.comboSelections} 
                onSelect={logic.selectComboOption} 
              />
            )}

            {/* 2. MOTOR VARIANTES (FROZEN) */}
            {product.behavior === 'SIMPLE_VARIANT' && product.variantConfig && (
              <VariantSelector 
                groups={product.variantConfig.groups} 
                selections={logic.variantSelections} 
                onSelect={logic.selectVariant} 
              />
            )}

            {/* 3. MOTOR BUILDER (PIZZAS) */}
            {product.behavior === 'CUSTOM_BUILDER' && product.builderConfig && (
               <IngredientSelector 
                 ingredients={product.builderConfig.ingredients}
                 selectedIds={logic.selectedIngredients}
                 onToggle={logic.toggleIngredient}
               />
            )}
          </div>

          {/* FOOTER ACCIÓN */}
          <div className="p-4 bg-[#121212] border-t border-[#333]">
            <button 
              onClick={handleConfirm}
              className="w-full py-4 bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold text-xl rounded-xl shadow-[0_0_20px_rgba(255,87,34,0.3)] flex justify-between px-6 items-center transition-transform active:scale-95"
            >
              <span>Agregar al Pedido</span>
              <span className="md:hidden">${logic.totalPrice.toFixed(2)}</span>
              <span className="hidden md:inline">Confirmar →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};