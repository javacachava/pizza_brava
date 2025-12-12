import type { OrderItem } from '../models/OrderItem';
import type { OrderType } from '../models/Order';

export interface OrderValidationResult {
  isValid: boolean;
  error?: string;
}

export const orderValidators = {
  /**
   * Valida si la orden cumple con los requisitos mínimos antes de enviarse.
   * Reglas basadas en el Contexto Operacional del POS.
   */
  validateOrder(
    cart: OrderItem[],
    orderType: OrderType,
    meta: {
      tableId?: string | null;
      customerName?: string;
      phone?: string;
      address?: string;
    }
  ): OrderValidationResult {
    // 1. El carrito no puede estar vacío
    if (!cart || cart.length === 0) {
      return { isValid: false, error: 'El carrito está vacío.' };
    }

    // 2. Validación por Tipo de Orden
    switch (orderType) {
      case 'mesa':
        // Regla 3.4 del Contexto: Si orderType = mesa → mesa es obligatoria.
        if (!meta.tableId) {
          return { isValid: false, error: 'Debe seleccionar una mesa para este pedido.' };
        }
        break;

      case 'llevar':
        // Regla 4: Si llevar → exigir nombre.
        if (!meta.customerName || meta.customerName.trim().length === 0) {
          return { isValid: false, error: 'El nombre del cliente es obligatorio para llevar.' };
        }
        break;

      case 'pedido': // Delivery
        // Regla 4: Si delivery → exigir nombre + teléfono + dirección.
        if (!meta.customerName || !meta.phone || !meta.address) {
          return { isValid: false, error: 'Delivery requiere Nombre, Teléfono y Dirección.' };
        }
        break;
    }

    return { isValid: true };
  }
};