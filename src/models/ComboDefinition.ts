import type { ID, Timestamp } from './SharedTypes';

/**
 * Reglas de selección del slot
 */
export type ComboSlotRequirement = 'required' | 'optional';

/**
 * Slot dentro de un ComboDefinition (grupo de selección)
 */
export interface ComboSlot {
  id: ID;
  name: string;
  required: ComboSlotRequirement;
  min?: number; // mínimo permitido
  max?: number; // máximo permitido
  allowedProductIds?: ID[]; // si se omite o está vacío => todos permitidos
}

/**
 * ComboDefinition
 * Plantilla editable por admin
 */
export interface ComboDefinition {
  id: ID;
  name: string;
  description?: string;
  basePrice?: number;
  isActive?: boolean;
  slots?: ComboSlot[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
