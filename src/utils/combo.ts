import type { Combo, ComboDefinition } from '../models/Combo';
import { generateSafeId } from './id';

export function validateCombo(
  def: ComboDefinition,
  selections: Record<string, string[]>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  (def.slots || []).forEach(slot => {
    const chosen = selections[slot.id] || [];

    if (slot.required === 'required' && chosen.length === 0) {
      errors.push(`El slot "${slot.name}" es obligatorio.`);
    }
    if (slot.min && chosen.length < slot.min) {
      errors.push(`El slot "${slot.name}" requiere al menos ${slot.min} elementos.`);
    }
    if (slot.max && chosen.length > slot.max) {
      errors.push(`El slot "${slot.name}" tiene un máximo de ${slot.max}.`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function generateComboInstance(
  def: ComboDefinition,
  selections: Record<string, string[]>
): Combo {
  return {
    id: generateSafeId(),
    comboDefinitionId: def.id,
    name: def.name,
    price: def.basePrice ?? 0,
    items: Object.entries(selections).flatMap(([slotId, productIds]) =>
      productIds.map(pid => ({
        productId: pid,
        quantity: 1
      }))
    )
  };
}
