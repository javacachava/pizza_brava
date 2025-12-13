import { useState, useMemo } from 'react';
import { useMenuContext } from '../../../contexts/MenuContext';
import type { ProductUI, ProductBehavior } from '../../../models/ProductTypes';
import type { MenuItem } from '../../../models/MenuItem';
import { ProductSelectionModal } from '../../components/modals/ProductSelectionModal';
import { CartSidebar } from './CartSidebar'; 

// Iconos simples para las categorías (puedes expandir esto)
const CATEGORY_ICONS: Record<string, string> = {
  'pizzas': '🍕',
  'combos': '📦',
  'bebidas': '🥤',
  'frozen': '🍧',
  'default': '🍽️'
};

export const POSPage = () => {
  // 1. OBTENCIÓN DE DATOS (BLINDADA)
  // Extraemos items y categorías reales de la DB
  const { items = [], categories = [], loading } = useMenuContext(); 
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [productToEdit, setProductToEdit] = useState<ProductUI | null>(null);

  // 2. CONVERTIDOR DE DATOS (DB -> UI)
  const convertToProductUI = (item: MenuItem): ProductUI => {
    let behavior: ProductBehavior = 'STANDARD';
    
    // Lógica para determinar qué ventana abrir según tus flags de la DB
    if (item.comboEligible) behavior = 'COMBO_PACK';
    else if (item.usesIngredients) behavior = 'CUSTOM_BUILDER';
    else if (item.usesFlavors) behavior = 'SIMPLE_VARIANT';

    return {
      ...item,
      behavior,
      // Inicializadores seguros para evitar crashes
      comboConfig: item.comboEligible ? { slots: [] } : undefined, 
      builderConfig: item.usesIngredients ? { ingredients: [] } : undefined,
      variantConfig: item.usesFlavors ? { groups: [] } : undefined,
    };
  };

  // 3. FILTRADO INTELIGENTE
  const filteredProducts = useMemo(() => {
    if (!items) return [];

    return items.filter((p) => {
      // Filtro por Categoría
      const matchesCategory = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
      
      // Filtro por Buscador
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de disponibilidad (Opcional: solo mostrar productos disponibles)
      // const isAvailable = p.isAvailable !== false;

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategoryId, searchTerm]);

  // Manejador de click en producto
  const handleProductClick = (item: MenuItem) => {
    setProductToEdit(convertToProductUI(item));
  };

  // Manejador para agregar al carrito (Conexión final)
  const handleAddToCart = (finalItem: any) => {
    console.log("🔥 PRODUCTO AGREGADO AL CARRITO:", finalItem);
    // AQUÍ VA TU LÓGICA DE USEPOS O USEORDER
    // ejemplo: addItemToOrder(finalItem);
  };

  // --- RENDERIZADO ---

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 border-4 border-[#FF5722] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Cargando menú...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#121212] overflow-hidden font-sans text-gray-100">
      
      {/* =======================================================
          COLUMNA IZQUIERDA: MENÚ (70-75%)
      ======================================================= */}
      <div className="flex-1 flex flex-col h-full relative border-r border-[#333]">
        
        {/* --- HEADER SUPERIOR (Buscador y Categorías) --- */}
        <header className="flex flex-col gap-4 p-4 md:p-6 bg-[#121212]/95 backdrop-blur z-10 border-b border-[#333]">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Buscador Estilo Google Glass */}
            <div className="relative w-full md:w-1/3 group">
              <input 
                type="text" 
                placeholder="¿Qué desea ordenar hoy?" 
                className="w-full bg-[#1E1E1E] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-[#FF5722] transition-colors">
                🔍
              </span>
            </div>

            {/* Selector de Categorías (Scroll Horizontal) */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 custom-scrollbar">
              {/* Botón 'Todo' */}
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border
                  ${selectedCategoryId === 'all' 
                    ? 'bg-[#FF5722] border-[#FF5722] text-white shadow-lg shadow-[#FF5722]/20' 
                    : 'bg-[#1E1E1E] border-transparent text-gray-400 hover:bg-[#2A2A2A] hover:text-white hover:border-gray-600'}
                `}
              >
                <span>🍽️</span> Todo
              </button>

              {/* Botones Dinámicos desde la DB */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border
                    ${selectedCategoryId === cat.id 
                      ? 'bg-[#FF5722] border-[#FF5722] text-white shadow-lg shadow-[#FF5722]/20' 
                      : 'bg-[#1E1E1E] border-transparent text-gray-400 hover:bg-[#2A2A2A] hover:text-white hover:border-gray-600'}
                  `}
                >
                  <span>{CATEGORY_ICONS[cat.name.toLowerCase()] || CATEGORY_ICONS['default']}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* --- GRID DE PRODUCTOS (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0f0f0f]">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group relative bg-[#1E1E1E] rounded-2xl overflow-hidden cursor-pointer border border-[#333] hover:border-[#FF5722] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,87,34,0.15)] flex flex-col h-[280px]"
                >
                  {/* Imagen */}
                  <div className="h-[55%] w-full relative overflow-hidden bg-gray-800">
                     {product.imageUrl ? (
                       <img 
                         src={product.imageUrl} 
                         alt={product.name} 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-5xl select-none opacity-50">🍕</div>
                     )}
                     {/* Gradiente sutil */}
                     <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent opacity-80" />
                  </div>
                  
                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-gray-100 text-lg leading-tight line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-1">
                        {product.description || "Deliciosa opción de la casa"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                       <span className="text-[#FF5722] font-black text-xl">
                         ${product.price.toFixed(2)}
                       </span>
                       
                       {/* Botón visual de '+' */}
                       <div className="w-8 h-8 rounded-full bg-[#333] group-hover:bg-[#FF5722] flex items-center justify-center text-white transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                         </svg>
                       </div>
                    </div>
                  </div>

                  {/* Etiqueta de Configurable */}
                  {(product.comboEligible || product.usesIngredients || product.usesFlavors) && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
                      PERSONALIZABLE
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Estado Vacio
              <div className="col-span-full flex flex-col items-center justify-center h-96 text-gray-500 gap-4">
                <div className="w-20 h-20 bg-[#1E1E1E] rounded-full flex items-center justify-center text-4xl">
                  🍽️
                </div>
                <p className="text-lg font-medium">No se encontraron productos en esta categoría.</p>
                <button 
                  onClick={() => { setSelectedCategoryId('all'); setSearchTerm(''); }}
                  className="text-[#FF5722] hover:underline"
                >
                  Ver todo el menú
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* =======================================================
          COLUMNA DERECHA: CARRITO (25-30%)
      ======================================================= */}
      <div className="w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#333] shadow-2xl z-20 flex flex-col">
         {/* Sidebar del carrito */}
         <CartSidebar cart={[]} onIncrease={function (index: number): void {
          throw new Error('Function not implemented.');
        } } onDecrease={function (index: number): void {
          throw new Error('Function not implemented.');
        } } onRemove={function (index: number): void {
          throw new Error('Function not implemented.');
        } } onClear={function (): void {
          throw new Error('Function not implemented.');
        } } onProcess={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </div>

      {/* =======================================================
          MODAL DE SELECCIÓN (FLOTANTE)
      ======================================================= */}
      <ProductSelectionModal 
        isOpen={!!productToEdit} 
        onClose={() => setProductToEdit(null)} 
        product={productToEdit}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
};