import React, { useState } from 'react';
import { useMenuContext } from '@/contexts/MenuContext'; // Tu context existente
import { Product } from '@/models/ProductTypes';
import { ProductSelectionModal } from '@/app/components/modals/ProductSelectionModal';

const CATEGORIES = [
  { id: 'all', label: 'Todo' },
  { id: 'combos', label: 'Combos' },
  { id: 'pizzas', label: 'Pizzas' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'frozen', label: 'Frozen' },
];

export const POSPage = () => {
  const { products } = useMenuContext(); // Asumo que esto trae los productos
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para manejar el modal
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Lógica de Filtrado
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col p-4 md:p-6 gap-6">
      
      {/* HEADER: Buscador y Categorías */}
      <header className="flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-10 bg-[#121212]/95 backdrop-blur py-2">
        
        {/* Buscador Estilo Google Glass */}
        <div className="relative w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Buscar producto..." 
            className="w-full bg-[#1E1E1E] border border-[#333] rounded-full py-3 px-12 text-white focus:outline-none focus:border-[#FF5722] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-3.5 text-gray-500">🔍</span>
        </div>

        {/* Tabs de Categoría */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm transition-all
                ${selectedCategory === cat.id 
                  ? 'bg-[#FF5722] text-white shadow-[0_0_15px_rgba(255,87,34,0.4)]' 
                  : 'bg-[#1E1E1E] text-gray-400 hover:bg-[#2A2A2A] hover:text-white'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            onClick={() => setProductToEdit(product)} // ABRIR MODAL
            className="group bg-[#1E1E1E] rounded-2xl overflow-hidden cursor-pointer border border-transparent hover:border-[#FF5722] transition-all hover:-translate-y-1 shadow-lg"
          >
            {/* Imagen */}
            <div className="h-40 overflow-hidden relative">
               <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent opacity-60" />
            </div>
            
            {/* Info */}
            <div className="p-4">
              <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
              <p className="text-[#FF5722] font-bold text-xl">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE SELECCIÓN */}
      <ProductSelectionModal 
        isOpen={!!productToEdit} 
        onClose={() => setProductToEdit(null)} 
        product={productToEdit}
        onAddToCart={(item) => {
           console.log("Agregado al carrito:", item);
           // Aquí llamarías a tu cartService.addItem(item)
        }}
      />
    </div>
  );
};