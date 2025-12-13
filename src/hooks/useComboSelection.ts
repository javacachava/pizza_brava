// hooks/useComboSelection.ts

import { useState, useMemo } from 'react';
import { Product, ComboItem } from '../models/MenuItem'; // Asumiendo tus tipos

export const useComboSelection = (comboProduct: Product) => {
  // Estado para guardar qué ha seleccionado el usuario (ej: { drink: 'Coca Cola', side: 'Papas' })
  const [selections, setSelections] = useState<Record<string, ComboItem>>({});

  // 1. Inicializar con los defaults al abrir el modal
  // (Esto evita que el usuario tenga que seleccionar todo desde cero)
  useEffect(() => {
    const defaultSelections = {};
    comboProduct.comboGroups?.forEach(group => {
        // Buscamos el item por defecto o el primero de la lista
        const defaultItem = group.options.find(opt => opt.isDefault) || group.options[0];
        defaultSelections[group.id] = defaultItem;
    });
    setSelections(defaultSelections);
  }, [comboProduct]);

  // 2. Lógica de Precio Dinámico (Lo que pediste conservar)
  // Precio Final = Precio Base del Combo + Suma de Extras
  const totalPrice = useMemo(() => {
    let extraCost = 0;

    comboProduct.comboGroups?.forEach(group => {
      const selectedItem = selections[group.id];
      const defaultItem = group.options.find(opt => opt.isDefault) || group.options[0];

      if (selectedItem && selectedItem.id !== defaultItem.id) {
        // Si el item seleccionado es más caro que el base, sumamos la diferencia
        // Si es igual o menor, usualmente no se descuenta (regla de negocio estándar), o se suma 0.
        const difference = Math.max(0, selectedItem.price - defaultItem.price); 
        extraCost += difference;
      }
    });

    return comboProduct.price + extraCost;
  }, [comboProduct, selections]);

  // 3. Función para cambiar bebida o complemento
  const selectOption = (groupId: string, item: ComboItem) => {
    setSelections(prev => ({
      ...prev,
      [groupId]: item
    }));
  };

  return {
    selections,
    totalPrice,
    selectOption
  };
};