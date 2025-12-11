import type { ID } from './SharedTypes';

/**
 * Combo instanciado (cuando el usuario agrega un combo al carrito o pedido)
 */
export interface Combo {
  id: ID;
  comboDefinitionId: ID;
  name: string;
  price: number;
  items: Array<{
    productId: ID;
    quantity: number;
    unitPrice?: number;
  }>;
}
