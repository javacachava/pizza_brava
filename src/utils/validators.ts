import type { MenuItem } from '../models/MenuItem';
import type { Order } from '../models/Order';
import type { ComboDefinition } from '../models/Combo';

export function validateMenuItem(item: Partial<MenuItem>): string[] {
  const errors: string[] = [];
  if (!item.name) errors.push('El producto requiere un nombre.');
  if (item.price == null) errors.push('El producto requiere precio.');
  if (!item.categoryId) errors.push('El producto requiere categoría.');
  return errors;
}

export function validateOrder(order: Partial<Order>): string[] {
  const errors: string[] = [];
  if (!order.items || order.items.length === 0)
    errors.push('La orden no puede estar vacía.');
  if (!order.orderType) errors.push('La orden requiere un tipo.');
  return errors;
}

export function validateComboDefinition(def: Partial<ComboDefinition>): string[] {
  const errors: string[] = [];
  if (!def.name) errors.push('El combo requiere un nombre.');
  return errors;
}
