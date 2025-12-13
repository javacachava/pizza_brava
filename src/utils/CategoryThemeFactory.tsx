import React from 'react';
import { 
  Pizza, 
  CupSoda, 
  Wine, 
  IceCream, 
  UtensilsCrossed, 
  Sandwich, 
  Package,
  Soup
} from 'lucide-react';

export interface CategoryTheme {
  icon: React.ElementType; // Cambiamos a ElementType para pasar el componente Lucide
  gradient: string; // Gradiente para el ícono (bg-gradient-to-br ...)
  textColor: string; // Color del precio (text-sky-400, etc.)
  borderColor: string; // Borde sutil (opcional)
}

const DEFAULT_THEME: CategoryTheme = {
  icon: UtensilsCrossed,
  gradient: 'from-gray-400 to-gray-600',
  textColor: 'text-gray-400',
  borderColor: 'border-gray-800'
};

const THEME_MAP: Record<string, CategoryTheme> = {
  'pizzas': {
    icon: Pizza,
    gradient: 'from-orange-400 to-red-500',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500/20'
  },
  'bebidas': {
    icon: CupSoda,
    gradient: 'from-sky-400 to-cyan-300',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/20'
  },
  'drinks': {
    icon: Wine,
    gradient: 'from-purple-400 to-fuchsia-500',
    textColor: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/20'
  },
  'combos': {
    icon: Package, // O Utensils
    gradient: 'from-emerald-400 to-green-500',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20'
  },
  'postres': {
    icon: IceCream,
    gradient: 'from-pink-400 to-rose-400',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/20'
  },
  'frozens': {
    icon: IceCream, // O Snowflake si prefieres
    gradient: 'from-cyan-300 to-blue-400',
    textColor: 'text-cyan-300',
    borderColor: 'border-cyan-500/20'
  },
  'entradas': {
    icon: Soup, // O Sandwich
    gradient: 'from-amber-400 to-yellow-500',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/20'
  },
  'hamburguesas': {
    icon: Sandwich,
    gradient: 'from-yellow-400 to-orange-500',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/20'
  },
  'all': {
    icon: UtensilsCrossed,
    gradient: 'from-orange-500 to-red-500',
    textColor: 'text-white',
    borderColor: 'border-white/10'
  }
};

export class CategoryThemeFactory {
  static getTheme(categoryNameOrId: string): CategoryTheme {
    const key = (categoryNameOrId || '').toLowerCase();
    
    // Búsqueda exacta
    if (THEME_MAP[key]) return THEME_MAP[key];

    // Búsqueda parcial
    const foundKey = Object.keys(THEME_MAP).find(k => key.includes(k));
    
    return foundKey ? THEME_MAP[foundKey] : DEFAULT_THEME;
  }
}