// Define los 3 comportamientos posibles del sistema
export type ProductBehavior = 'SIMPLE_VARIANT' | 'COMBO_PACK' | 'CUSTOM_BUILDER';

// --- LOGICA 1: FROZENS (Variantes) ---
export interface VariantOption {
  id: string;
  name: string; // "Fresa", "Mango"
}

export interface VariantGroup {
  id: string;
  name: string; // "Sabor"
  options: VariantOption[];
}

// --- LOGICA 2: COMBOS (Slots Intercambiables) ---
export interface ComboOption {
  id: string;
  name: string;
  price: number; // Precio base del item individual
  image?: string;
}

export interface ComboSlot {
  id: string;
  title: string; // "Elige tu Bebida"
  isSwappable: boolean; // ¿El recepcionista puede cambiar esto?
  options: ComboOption[];
  defaultOptionId: string; // Lo que trae el combo por defecto
}

// --- LOGICA 3: PIZZAS (Ingredientes / Builder) ---
export interface Ingredient {
  id: string;
  name: string;
  price: number; // Costo si es extra
  isDefault: boolean; // true = Ya viene en la pizza (sin costo extra)
  image?: string;
}

// --- PRODUCTO MAESTRO ---
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Precio Base
  image: string;
  categoryId: string; // "bebidas", "pizzas", "combos"
  
  // El "Cerebro" que decide qué ventana abrir
  behavior: ProductBehavior;

  // Configuraciones específicas (Opcionales)
  variantConfig?: { groups: VariantGroup[] };
  comboConfig?: { slots: ComboSlot[] };
  builderConfig?: { ingredients: Ingredient[] };
}