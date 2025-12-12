import { useState } from 'react';
import { usePOSContext } from '../contexts/POSContext';
import { container } from '../models/di/container';
import type { MenuItem } from '../models/MenuItem';
import type { OrderItem, SelectedOption } from '../models/OrderItem';
import type { Order, OrderType } from '../models/Order';
import { cartService } from '../services/domain/cartService';
import { orderValidators } from '../utils/validators';
import { generateId } from '../utils/id';
import { toast } from 'react-hot-toast';

export function usePOSCommands() {
  const { cart, addOrderItem, updateQuantity, removeIndex, clear } = usePOSContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ordersService = container.ordersService;

  // --- Comandos ---

  const increaseQuantity = (index: number) => updateQuantity(index, 1);

  const decreaseQuantity = (index: number) => {
    // Si tiene 1 y restamos, pasará a 0 y cartService lo eliminará.
    // O podemos llamar a removeIndex explícitamente para feedback visual.
    if (cart[index].quantity === 1) {
       removeIndex(index); // Eliminación directa
    } else {
       updateQuantity(index, -1);
    }
  };

  const removeItem = (index: number) => {
    removeIndex(index);
  };

  const clearOrder = () => {
    if (cart.length > 0 && confirm('¿Limpiar orden?')) clear();
  };

  const addProductToCart = (
    product: MenuItem, 
    quantity: number = 1, 
    notes: string = '',
    options: SelectedOption[] = []
  ) => {
    const item = cartService.createItemFromProduct(product, quantity, notes);
    if (options.length > 0) item.selectedOptions = options;
    
    // addOrderItem usa cartService.addItem que agrupa si es igual
    addOrderItem(item);
    toast.success(`${product.name} agregado`);
  };

  const addComboToCart = (comboItem: OrderItem) => {
    addOrderItem(comboItem);
    toast.success('Combo agregado');
  };

  const submitOrder = async (type: OrderType, meta: any) => {
    const validation = orderValidators.validateOrder(cart, type, meta);
    if (!validation.isValid) {
      toast.error(validation.error || 'Error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder: Order = {
        id: generateId(),
        items: [...cart],
        total: cartService.calculateTotal(cart),
        status: 'pendiente',
        orderType: type,
        createdAt: new Date() as any,
        tableNumber: meta.tableId || null,
        customerName: meta.customerName || 'Cliente',
        meta: { ...meta }
      };

      await ordersService.createOrder(newOrder);
      toast.success('Orden enviada');
      clear();
    } catch (error) {
      console.error(error);
      toast.error('Error enviando orden');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    cart,
    isSubmitting,
    commands: {
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearOrder,
      addProductToCart,
      addComboToCart,
      submitOrder
    }
  };
}