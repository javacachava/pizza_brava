import React from 'react';
// Iconos de React Icons (Material Design y FontAwesome 6)
import { MdLocalPizza, MdLunchDining, MdLocalBar, MdIcecream, MdRestaurantMenu, MdFastfood } from 'react-icons/md';
import { FaBurger, FaBowlFood, FaWineGlass } from 'react-icons/fa6';
import { BiSolidDish } from 'react-icons/bi';

// Interfaz para el tema
export interface CategoryTheme {
  icon: React.ReactElement;
  gradient: string; // Clases de Tailwind para el fondo
  accentColor: string; // Color de texto/borde
  shadowColor: string; // Color de sombra
}

// Configuración por defecto
const DEFAULT_THEME: CategoryTheme = {
  icon: <MdFastfood />,
  gradient: 'from-gray-700 to-gray-900',
  accentColor: 'text-gray-400',
  shadowColor: 'shadow-gray-900/50'
};

// Mapa de configuraciones (Extensible)
const THEME_MAP: Record<string, CategoryTheme> = {
  'pizzas': {
    icon: <MdLocalPizza />,
    gradient: 'from-orange-500 to-red-600',
    accentColor: 'text-orange-500',
    shadowColor: 'shadow-orange-500/40'
  },
  'bebidas': {
    icon: <MdLocalBar />,
    gradient: 'from-blue-400 to-indigo-600',
    accentColor: 'text-blue-400',
    shadowColor: 'shadow-blue-500/40'
  },
  'drinks': {
    icon: <FaWineGlass />,
    gradient: 'from-purple-500 to-pink-600',
    accentColor: 'text-purple-400',
    shadowColor: 'shadow-purple-500/40'
  },
  'hamburguesas': {
    icon: <FaBurger />,
    gradient: 'from-yellow-500 to-orange-600',
    accentColor: 'text-yellow-500',
    shadowColor: 'shadow-yellow-500/40'
  },
  'combos': {
    icon: <MdLunchDining />,
    gradient: 'from-emerald-400 to-green-600',
    accentColor: 'text-emerald-400',
    shadowColor: 'shadow-emerald-500/40'
  },
  'postres': {
    icon: <MdIcecream />,
    gradient: 'from-pink-400 to-rose-500',
    accentColor: 'text-pink-400',
    shadowColor: 'shadow-pink-500/40'
  },
  'frozens': {
    icon: <MdIcecream />,
    gradient: 'from-cyan-400 to-blue-500',
    accentColor: 'text-cyan-400',
    shadowColor: 'shadow-cyan-500/40'
  },
  'entradas': {
    icon: <FaBowlFood />,
    gradient: 'from-amber-600 to-orange-700',
    accentColor: 'text-amber-500',
    shadowColor: 'shadow-amber-500/40'
  },
  'all': {
    icon: <MdRestaurantMenu />,
    gradient: 'from-[#FF5722] to-[#D84315]', // Tu naranja corporativo
    accentColor: 'text-[#FF5722]',
    shadowColor: 'shadow-[#FF5722]/40'
  }
};

export class CategoryThemeFactory {
  /**
   * Obtiene el tema visual basado en el nombre o ID de la categoría.
   * Utiliza búsqueda parcial (includes) para mayor flexibilidad.
   */
  static getTheme(categoryNameOrId: string): CategoryTheme {
    const key = categoryNameOrId.toLowerCase();
    
    // 1. Búsqueda exacta
    if (THEME_MAP[key]) return THEME_MAP[key];

    // 2. Búsqueda por coincidencia de texto (ej: "Bebidas Calientes" -> match "bebidas")
    const foundKey = Object.keys(THEME_MAP).find(k => key.includes(k));
    
    return foundKey ? THEME_MAP[foundKey] : DEFAULT_THEME;
  }
}