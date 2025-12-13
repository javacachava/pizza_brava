import { useState, useMemo } from 'react';
import { useMenuContext } from '../../../contexts/MenuContext';
import { usePOSCommands } from '../../../hooks/usePOSCommands';
import type { MenuItem } from '../../../models/MenuItem';
import type { ProductUI, ProductBehavior } from '../../../models/ProductTypes';
import { ProductSelectionModal } from '../../components/modals/ProductSelectionModal';
import { CartSidebar } from './CartSidebar';
import { OrderTypeModal } from './OrderTypeModal';
import { useTables } from '../../../hooks/useTables';

// --- ICONOS SVG PROFESIONALES (Sin librerías externas) ---
const Icons = {
  All: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  ),
  Pizza: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  ),
  Drink: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
  ),
  Combo: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  ),
  Frozen: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  ),
  Default: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
  )
};

// Función helper para asignar iconos según el nombre de la categoría
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('pizza')) return <Icons.Pizza />;
  if (n.includes('bebida') || n.includes('drink')) return <Icons.Drink />;
  if (n.includes('combo')) return <Icons.Combo />;
  if (n.includes('frozen')) return <Icons.Frozen />;
  return <Icons.Default />;
};

export const POSPage = () => {
  const { items, categories, loading } = useMenuContext();
  // hooks
  const { commands, cart, isSubmitting } = usePOSCommands();
  const { tables } = useTables();
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI States
  const [productToConfig, setProductToConfig] = useState<ProductUI | null>(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  // 2. TRANSFORMACIÓN DE DATOS (DB -> UI)
  const convertToProductUI = (item: MenuItem): ProductUI => {
    let behavior: ProductBehavior = 'STANDARD';
    
    if (item.comboEligible) behavior = 'COMBO_PACK';
    else if (item.usesIngredients) behavior = 'CUSTOM_BUILDER';
    else if (item.usesFlavors) behavior = 'SIMPLE_VARIANT';

    return {
      ...item,
      behavior,
      comboConfig: item.comboEligible ? { slots: [] } : undefined, 
      builderConfig: item.usesIngredients ? { ingredients: [] } : undefined,
      variantConfig: item.usesFlavors ? { groups: [] } : undefined,
    };
  };

  // 3. LÓGICA DE FILTRADO
  const filteredProducts = useMemo(() => {
    if (!items) return [];

    return items.filter((product) => {
      const pCatId = String(product.categoryId || '');
      const selCatId = String(selectedCategoryId);
      
      const matchesCategory = selectedCategoryId === 'all' || pCatId === selCatId;
      const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategoryId, searchTerm]);

  const handleProductClick = (item: MenuItem) => {
    const uiProduct = convertToProductUI(item);

    // Si requiere configuración, abrimos modal
    if (uiProduct.behavior !== 'STANDARD') {
        setProductToConfig(uiProduct);
    } else {
        // Agregar directo
        commands.addProductToCart(item);
    }
  };

  const handleConfigComplete = (finalItem: any) => {
    // Adapter para el hook de commands
    // finalItem trae: { product, finalPrice, modifiers }
    // Aquí mapeamos la salida del builder a lo que espera addProductToCart
    // (Simplificado por ahora)
    commands.addProductToCart(finalItem.product, 1, "Configuración personalizada"); 
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#FF5722] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium animate-pulse">Cargando Menú...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0F0F0F] text-gray-100 overflow-hidden font-sans selection:bg-[#FF5722] selection:text-white">
      
      {/* ====================================
          COL 1: SIDEBAR CATEGORÍAS
      ==================================== */}
      <nav className="w-[100px] md:w-[120px] flex flex-col items-center py-6 bg-[#161616] border-r border-[#2A2A2A] z-20 shadow-2xl h-full overflow-y-auto no-scrollbar">
        <div className="mb-8 p-3 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#D84315] shadow-lg shadow-orange-900/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>

        <div className="flex flex-col gap-4 w-full px-3">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`
              group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 w-full aspect-square relative overflow-hidden
              ${selectedCategoryId === 'all' 
                ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30 scale-100' 
                : 'bg-[#1E1E1E] text-gray-500 hover:bg-[#252525] hover:text-gray-200'}
            `}
          >
            <div className={`transition-transform duration-300 ${selectedCategoryId === 'all' ? 'scale-110' : 'group-hover:scale-110'}`}>
              <Icons.All />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-center">Todo</span>
          </button>

          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(String(cat.id))}
              className={`
                group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 w-full aspect-square relative
                ${String(selectedCategoryId) === String(cat.id)
                  ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30 scale-100' 
                  : 'bg-[#1E1E1E] text-gray-500 hover:bg-[#252525] hover:text-gray-200'}
              `}
            >
              <div className={`transition-transform duration-300 ${String(selectedCategoryId) === String(cat.id) ? 'scale-110' : 'group-hover:scale-110'}`}>
                {getCategoryIcon(cat.name)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ====================================
          COL 2: GRID DE PRODUCTOS
      ==================================== */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-[#2A2A2A] bg-[#161616]/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Menú Principal</h1>
            <p className="text-sm text-gray-500">Selecciona productos para la orden</p>
          </div>
          
          <div className="relative">
            <input 
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 bg-[#0F0F0F] border border-[#333] rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] transition-all"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </header>

        {/* Grid SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-8">
           <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
             {filteredProducts.map(p => (
               <button 
                 key={p.id}
                 onClick={() => handleProductClick(p)}
                 className="group bg-[#1E1E1E] rounded-2xl border border-[#333] hover:border-[#FF5722] hover:shadow-xl hover:shadow-orange-900/10 transition-all duration-300 overflow-hidden text-left flex flex-col h-64"
               >
                 {/* Imagen (Placeholder o Real) */}
                 <div className="h-40 bg-[#252525] relative overflow-hidden">
                   {/* Overlay gradiente */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent opacity-60 z-10"/>
                   
                   {/* Imagen o Icono */}
                   <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500 text-gray-700">
                     🍔
                   </div>
                 </div>

                 {/* Info */}
                 <div className="p-4 flex-1 flex flex-col">
                   <h3 className="font-bold text-gray-100 text-lg leading-tight mb-1 group-hover:text-[#FF5722] transition-colors">{p.name}</h3>
                   <div className="mt-auto flex justify-between items-center">
                     <span className="text-xl font-bold text-white">${p.price.toFixed(2)}</span>
                     <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-[#FF5722] group-hover:bg-[#FF5722] group-hover:text-white transition-colors">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                     </div>
                   </div>
                 </div>
               </button>
             ))}
           </div>
        </div>
      </main>

      {/* ====================================
          COL 3: CART SIDEBAR
      ==================================== */}
      <CartSidebar 
        cart={cart}
        onIncrease={commands.increaseQuantity}
        onDecrease={commands.decreaseQuantity}
        onClear={commands.clearOrder}
        onProcess={() => setIsProcessModalOpen(true)}
        onRemove={commands.removeItem}
      />

      {/* ====================================
          MODALES
      ==================================== */}
      <ProductSelectionModal 
        isOpen={!!productToConfig}
        product={productToConfig}
        onClose={() => setProductToConfig(null)}
        onAddToCart={handleConfigComplete}
      />

      <OrderTypeModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        isLoading={isSubmitting}
        tables={tables}
        onConfirm={(type, meta) => {
          commands.submitOrder(type, meta).then(() => {
             // Si el carrito se limpia, cerramos modal
             if(cart.length === 0) setIsProcessModalOpen(false);
          });
        }}
      />

    </div>
  );
};

export default POSPage;