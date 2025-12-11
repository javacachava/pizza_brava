import type { ID } from './SharedTypes';
import type { Combo } from './Combo';

export interface SelectedOption {
  id: ID;
  name: string;
  price?: number;
}

export interface OrderItem {
  productId: ID | null; // null si es combo puro
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  comment?: string;
  selectedOptions?: SelectedOption[];
  isCombo?: boolean;
  combo?: Combo | null;
}
