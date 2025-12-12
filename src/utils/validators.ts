import type { OrderItem } from '../models/OrderItem';
import type { OrderType } from '../models/Order';

export interface OrderValidationResult {
  isValid: boolean;
  error?: string;
}

export const orderValidators = {
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
    if (!cart || cart.length === 0) {
      return { isValid: false, error: 'El carrito está vacío.' };
    }

    switch (orderType) {
      case 'mesa':
        if (!meta.tableId) {
          return { isValid: false, error: 'Debe seleccionar una mesa.' };
        }
        break;
      case 'llevar':
        if (!meta.customerName || meta.customerName.trim().length === 0) {
          return { isValid: false, error: 'Nombre del cliente obligatorio.' };
        }
        break;
      case 'pedido': // Delivery
        if (!meta.customerName || !meta.phone || !meta.address) {
          return { isValid: false, error: 'Delivery requiere nombre, teléfono y dirección.' };
        }
        break;
    }

    return { isValid: true };
  }
};