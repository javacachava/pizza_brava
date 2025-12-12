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
    if (cart[index].quantity > 1) updateQuantity(index, -1);
    else toast('Usa el botón eliminar');
  };
  const removeItem = (index: number) => {
    if (confirm('¿Eliminar?')) removeIndex(index);
  };
  const clearOrder = () => {
    if (cart.length > 0 && confirm('¿Limpiar orden?')) clear();
  };

  /**
   * Agrega producto con soporte completo para notas y OPCIONES (Sabores)
   */
  const addProductToCart = (
    product: MenuItem, 
    quantity: number = 1, 
    notes: string = '',
    options: SelectedOption[] = [] // <--- Nuevo argumento
  ) => {
    // 1. Crear item base
    const item = cartService.createItemFromProduct(product, quantity, notes);
    
    // 2. Adjuntar opciones (Sabores, etc)
    if (options.length > 0) {
      item.selectedOptions = options;
      // Opcional: Sumar precio de opciones si tuvieran costo
      // item.unitPrice += options.reduce((sum, opt) => sum + (opt.price || 0), 0);
      // item.totalPrice = item.unitPrice * quantity;
    }

    // 3. Agregar al carrito (el hook usePOS se encarga de agrupar)
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