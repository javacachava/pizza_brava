import type { Category } from '../models/Category';

export function sortCategories(categories: Category[]) {
  return [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function findCategory(categories: Category[], id: string) {
  return categories.find(c => c.id === id) || null;
}
