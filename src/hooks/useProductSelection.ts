import { useState, useMemo, useEffect } from 'react';
import type { Product, ComboOption, VariantOption } from '../models/ProductTypes';

export const useProductSelection = (product: Product) => {
  // Estados para los 3 motores
  const [comboSelections, setComboSelections] = useState<Record<string, ComboOption>>({});
  const [variantSelections, setVariantSelections] = useState<Record<string, VariantOption>>({});
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());

  // INICIALIZACIÓN AUTOMÁTICA
  useEffect(() => {
    // 1. Cargar defaults de Combos
    if (product.behavior === 'COMBO_PACK' && product.comboConfig) {
      const initial: Record<string, ComboOption> = {};
      product.comboConfig.slots.forEach(slot => {
        const defaultOpt = slot.options.find(o => o.id === slot.defaultOptionId) || slot.options[0];
        if (defaultOpt) initial[slot.id] = defaultOpt;
      });
      setComboSelections(initial);
    }

    // 2. Cargar ingredientes base de Pizzas
    if (product.behavior === 'CUSTOM_BUILDER' && product.builderConfig) {
      const defaultIds = product.builderConfig.ingredients
        .filter(i => i.isDefault)
        .map(i => i.id);
      setSelectedIngredients(new Set(defaultIds));
    }
    
    // 3. Preseleccionar primer sabor (Frozen)
    if (product.behavior === 'SIMPLE_VARIANT' && product.variantConfig) {
        const initialVars: Record<string, VariantOption> = {};
        product.variantConfig.groups.forEach(group => {
            initialVars[group.id] = group.options[0];
        });
        setVariantSelections(initialVars);
    }
  }, [product]);

  // CÁLCULO DE PRECIO INTELIGENTE
  const totalPrice = useMemo(() => {
    let total = product.price;

    // Lógica Combo: Precio Base + Diferencia (Si es mayor)
    if (product.behavior === 'COMBO_PACK' && product.comboConfig) {
      product.comboConfig.slots.forEach(slot => {
        const selected = comboSelections[slot.id];
        const defaultOpt = slot.options.find(o => o.id === slot.defaultOptionId) || slot.options[0];
        
        if (selected && defaultOpt) {
          const diff = Math.max(0, selected.price - defaultOpt.price);
          total += diff;
        }
      });
    }

    // Lógica Pizza: Precio Base + Extras
    if (product.behavior === 'CUSTOM_BUILDER' && product.builderConfig) {
      product.builderConfig.ingredients.forEach(ing => {
        const isSelected = selectedIngredients.has(ing.id);
        // Si el ingrediente NO es default (es extra) y está seleccionado, se cobra
        if (!ing.isDefault && isSelected) {
          total += ing.price;
        }
      });
    }

    return total;
  }, [product, comboSelections, selectedIngredients, variantSelections]);

  // ACCIONES
  const selectComboOption = (slotId: string, option: ComboOption) => {
    setComboSelections(prev => ({ ...prev, [slotId]: option }));
  };

  const toggleIngredient = (ingredientId: string) => {
    setSelectedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) newSet.delete(ingredientId);
      else newSet.add(ingredientId);
      return newSet;
    });
  };

  const selectVariant = (groupId: string, option: VariantOption) => {
      setVariantSelections(prev => ({ ...prev, [groupId]: option }));
  };

  return {
    comboSelections,
    selectedIngredients,
    variantSelections,
    totalPrice,
    selectComboOption,
    toggleIngredient,
    selectVariant
  };
};