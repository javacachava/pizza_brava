import type { ID, Timestamp } from './SharedTypes';

export interface MenuItem {
  id: ID;
  categoryId: ID;
  name: string;
  description?: string;
  price: number;
  isAvailable?: boolean;
  usesIngredients?: boolean;
  usesFlavors?: boolean;
  usesSizeVariant?: boolean;
  comboEligible?: boolean;
  imageUrl?: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
