import React from 'react';
import type { Category } from '../../../models/Category';

interface Props {
  categories: Category[];
  active: string | null;
  onChange: (id: string | null) => void;
}

export const CategoryTabs: React.FC<Props> = ({
  categories,
  active,
  onChange
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      <button
        className={`px-4 py-2 rounded-full border ${active === null ? 'bg-orange-600 text-white' : ''}`}
        onClick={() => onChange(null)}
      >
        Todo
      </button>

      {categories.map(cat => (
        <button
          key={cat.id}
          className={`px-4 py-2 rounded-full border whitespace-nowrap ${
            active === cat.id ? 'bg-orange-600 text-white' : ''
          }`}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};
