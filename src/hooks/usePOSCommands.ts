import { useState } from 'react';
import { usePOSContext } from '../contexts/POSContext';
import { container } from '../models/di/container';
import type { MenuItem } from '../models/MenuItem';
import type { OrderItem } from '../models/OrderItem';
import type { Order, OrderType } from '../models/Order';
import { orderValidators } from '../utils/validators';
import { generateId } from '../utils/id';
import { toast } from 'react-hot-toast'; // Asegúrate de tener react-hot-toast instalado

export function usePOSCommands() {
  const { cart, addProduct, addOrderItem, updateQuantity, removeIndex, clear } = usePOSContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ordersService = container.ordersService;

  // --- Commands ---

  const increaseQuantity = (index: number) => updateQuantity(index, 1);

  const decreaseQuantity = (index: number) => {
    const item = cart[index];
    if (item && item.quantity > 1) {
      updateQuantity(index, -1);
    } else {
      toast('Usa el botón de eliminar para quitar el producto');
    }
  };

  const removeItem = (index: number) => {
    removeIndex(index);
    toast.success('Producto eliminado');
  };

  const addProductToCart = (product: MenuItem) => {
    addProduct(product, 1);
    toast.success('Producto agregado');
  };

  const addComboToCart = (comboItem: OrderItem) => {
    addOrderItem(comboItem);
    toast.success('Combo agregado');
  };

  const clearOrder = () => {
    if (confirm('¿Limpiar orden actual?')) clear();
  };

  const submitOrder = async (
    orderType: OrderType,
    meta: {
      tableId?: string | null;
      tableName?: string;
      customerName?: string;
      phone?: string;
      address?: string;
      note?: string;
    }
  ) => {
    // 1. Validar
    const validation = orderValidators.validateOrder(cart, orderType, meta);
    if (!validation.isValid) {
      toast.error(validation.error || 'Error de validación');
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Construir Objeto Orden
      const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);
      
      const newOrder: Order = {
        id: generateId(),
        items: [...cart],
        total,
        subTotal: total, // Ajustar si manejas impuestos
        status: 'pendiente',
        orderType,
        createdAt: new Date() as any, // Ajuste de tipo según tu SharedTypes/Firebase
        tableNumber: meta.tableId || null,
        customerName: meta.customerName || 'Cliente',
        meta: {
          note: meta.note,
          phone: meta.phone,
          address: meta.address,
          tableName: meta.tableName
        }
      };

      // 3. Persistir
      await ordersService.createOrder(newOrder);
      
      toast.success('Orden enviada correctamente');
      clear();
      
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar la orden');
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
      addProductToCart,
      addComboToCart,
      clearOrder,
      submitOrder
    }
  };
}