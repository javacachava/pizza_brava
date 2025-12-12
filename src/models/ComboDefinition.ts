import type { ID } from './SharedTypes';

export interface ComboRules {
  allowCustomChoice: boolean;
  maxPizzas: number;
  maxDrinks: number;
  maxSides: number;
}

export interface ComboSlot {
  id: string;
  name: string;
  max: number;
  allowedProductIds: ID[];
}

export interface ComboDefinition {
  id: ID;
  categoryId: string; // "combos"
  name: string;
  description?: string; // Opcional en BD, pero usado en UI
  price: number;        // <--- FALTABA ESTO
  isAvailable: boolean; // <--- FALTABA ESTO
  itemsIncluded: string[]; 
  rules: ComboRules;    // <--- FALTABA ESTO
  
  // Slots opcionales para la lógica de selección (si tu UI lo requiere para armar combos dinámicos)
  slots?: ComboSlot[]; 
}