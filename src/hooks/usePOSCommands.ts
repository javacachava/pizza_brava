import { useState } from 'react';
import { usePOSContext } from '../contexts/POSContext';
import { container } from '../models/di/container'; // Inyección de dependencias
import type { MenuItem } from '../models/MenuItem';
import type { OrderItem } from '../models/OrderItem';
import type { Order, OrderType } from '../models/Order';
import { orderValidators } from '../utils/validators';
import { toast } from 'react-hot-toast';
import { generateId } from '../utils/id';
import { Timestamp } from 'firebase/firestore'; // O tu wrapper de fecha

/**
 * usePOSCommands
 * Capa de Aplicación. Orquesta la lógica de negocio del POS.
 * Principio: La UI no debe saber cómo se crea una orden o se calcula un total.
 */
export function usePOSCommands() {
  const { cart, addProduct, addOrderItem, updateQuantity, removeIndex, clear } = usePOSContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Servicios inyectados (Infrastructure Layer)
  const ordersService = container.ordersService; 
  // const cashService = container.cashService; // Si se implementa control de caja

  // --- Comandos de Carrito ---

  const increaseQuantity = (index: number) => updateQuantity(index, 1);

  const decreaseQuantity = (index: number) => {
    const item = cart[index];
    if (item && item.quantity > 1) {
      updateQuantity(index, -1);
    } else {
      // Opcional: Confirmar eliminación si llega a 0, o dejar que el botón 'Eliminar' lo haga.
      toast('Usa el botón eliminar para quitar el producto', { icon: 'ℹ️' });
    }
  };

  const removeItem = (index: number) => {
    removeIndex(index);
    toast.success('Producto eliminado');
  };

  const addProductToCart = (product: MenuItem) => {
    // Aquí podrías validar stock usando rules.enableStockManagement si fuera necesario
    addProduct(product, 1);
    toast.success(`${product.name} agregado`);
  };

  const addComboToCart = (comboItem: OrderItem) => {
    // El combo ya viene construido desde el ComboBuilder (Domain Layer logic happens there)
    addOrderItem(comboItem);
    toast.success('Combo agregado correctamente');
  };

  const clearOrder = () => {
    if (window.confirm('¿Estás seguro de limpiar la orden actual?')) {
      clear();
    }
  };

  // --- Comando de Envío de Orden (Core Business Logic) ---

  const submitOrder = async (
    orderType: OrderType,
    meta: {
      tableId?: string | null;
      tableName?: string; // Para display
      customerName?: string;
      phone?: string;
      address?: string;
      note?: string;
    }
  ) => {
    // 1. Validación de Dominio
    const validation = orderValidators.validateOrder(cart, orderType, meta);
    if (!validation.isValid) {
      toast.error(validation.error || 'Orden inválida');
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Construcción del Objeto Orden (Data Mapping)
      const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
      
      const newOrder: Order = {
        id: generateId(), // O dejar que Firestore lo genere
        items: [...cart], // Clonar para inmutabilidad
        total: total,
        subTotal: total, // Si hubiera impuestos, calcular aquí usando rules.taxRate
        status: 'pendiente',
        orderType: orderType,
        createdAt: new Date() as any, // Ajustar según tu tipo Timestamp
        
        // Mapeo de campos según tipo
        tableNumber: meta.tableId || null,
        customerName: meta.customerName || 'Cliente General',
        meta: {
          note: meta.note,
          phone: meta.phone,
          address: meta.address,
          tableName: meta.tableName
        }
      };

      // 3. Persistencia (Infrastructure Layer)
      await ordersService.createOrder(newOrder);

      // 4. Feedback y Limpieza
      toast.success('¡Orden enviada a cocina!');
      clear();
      
    } catch (error) {
      console.error('Error enviando orden:', error);
      toast.error('Error al guardar la orden. Intente de nuevo.');
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