import { useState, useMemo } from 'react';
import { useMenuContext } from '../../../contexts/MenuContext';
import { usePOSCommands } from '../../../hooks/usePOSCommands';
import { useTables } from '../../../hooks/useTables';

// Modelos
import type { MenuItem } from '../../../models/MenuItem';
import type { ProductUI, ProductBehavior, ComboSlot as UIComboSlot, ComboOption } from '../../../models/ProductTypes';
import type { ComboDefinition } from '../../../models/ComboDefinition';

// Utils
import { CategoryThemeFactory } from '../../../utils/CategoryThemeFactory';

// Componentes
import { ProductSelectionModal } from '../../components/modals/ProductSelectionModal';
import { CartSidebar } from './CartSidebar';
import { OrderTypeModal } from './OrderTypeModal';
import { ProductGrid } from './ProductGrid';

// 1. Fix CategoryButton: Remove shadowColor
const CategoryButton = ({ id, name, isActive, onClick }: { id: string, name: string, isActive: boolean, onClick: () => void }) => {
  const theme = CategoryThemeFactory.getTheme(name || id);
  const IconComponent = theme.icon;
  
  return (
    <button
      onClick={onClick}
      className={`
        group flex flex-col items-center justify-center gap-1 md:gap-2 p-2 rounded-2xl transition-all duration-300 w-full aspect-square relative
        ${isActive 
          ? `bg-gradient-to-br ${theme.gradient} text-white shadow-lg scale-100 ring-2 ring-offset-2 ring-offset-[#161616] ring-transparent` 
          : 'bg-[#1E1E1E] text-gray-500 hover:bg-[#252525] hover:text-gray-200'}
      `}
    >
      <div className={`text-xl md:text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {IconComponent && <IconComponent size={24} />}
      </div>
      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-center leading-tight truncate w-full px-1">
        {name}
      </span>
    </button>
  );
};


export const POSPage = () => {
  const { items, categories, combos, loading } = useMenuContext(); 
  const { commands, cart, isSubmitting } = usePOSCommands();
  const { tables } = useTables();
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [productToConfig, setProductToConfig] = useState<ProductUI | null>(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  // --- LOGICA DE ADAPTACIÓN CORREGIDA ---
  
  const convertProductToUI = (item: MenuItem): ProductUI => {
    let behavior: ProductBehavior = 'STANDARD';

    // CORRECCIÓN CRÍTICA:
    // comboEligible = true NO significa que sea un combo. Solo significa que cabe DENTRO de uno.
    // Solo si categoryId es 'combos' es un COMBO_PACK real.
    if (item.categoryId === 'combos') behavior = 'COMBO_PACK';
    else if (item.usesIngredients) behavior = 'CUSTOM_BUILDER';
    else if (item.usesFlavors) behavior = 'SIMPLE_VARIANT';

    return {
      ...item,
      behavior,
      // Solo inicializamos configuraciones si el comportamiento lo dicta
      comboConfig: behavior === 'COMBO_PACK' ? { slots: [] } : undefined, 
      builderConfig: item.usesIngredients ? { ingredients: [] } : undefined,
      variantConfig: item.usesFlavors ? { groups: [] } : undefined,
    };
  };

  const convertComboToUI = (combo: ComboDefinition): ProductUI => {
    // 1. Mapeo inicial de slots
    const rawSlots = combo.slots || [];
    
    // 2. Hidratación de slots con productos reales
    const hydratedSlots: UIComboSlot[] = rawSlots.map(dbSlot => {
        const validOptions: ComboOption[] = (items || [])
            .filter(item => dbSlot.allowedProductIds.includes(item.id))
            .map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.imageUrl || undefined
            }));
            
        return {
            id: dbSlot.id,
            title: dbSlot.name,
            isRequired: dbSlot.required === true || dbSlot.required === 'required',
            isSwappable: true,
            options: validOptions,
            defaultOptionId: validOptions[0]?.id || ''
        };
    });

    return {
      id: combo.id,
      name: combo.name,
      price: combo.price,
      categoryId: 'combos', // Categoría virtual explicita
      description: combo.description,
      behavior: 'COMBO_PACK',
      isActive: combo.isAvailable,
      code: `CMB-${combo.id}`,
      comboConfig: { slots: hydratedSlots },
      usesIngredients: false,
      usesFlavors: false,
      comboEligible: true, 
      isAlcoholic: false,
      isAvailable: combo.isAvailable, 
      createdAt: undefined, 
      updatedAt: undefined 
    } as ProductUI;
  };

  // --- FILTRADO ---

  const { filteredProducts, filteredCombos } = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const isAll = selectedCategoryId === 'all';
    const isComboCat = selectedCategoryId === 'combos';

    const fProducts = (items || []).filter(p => {
      // Si la categoría seleccionada es Combos, NO mostramos productos sueltos
      if (isComboCat) return false;
      
      const matchCat = isAll || p.categoryId === selectedCategoryId;
      const matchSearch = (p.name || '').toLowerCase().includes(term);
      return matchCat && matchSearch;
    });

    const fCombos = (combos || []).filter(c => {
      const matchCat = isAll || isComboCat;
      const matchSearch = (c.name || '').toLowerCase().includes(term);
      return matchCat && matchSearch;
    });

    return { filteredProducts: fProducts, filteredCombos: fCombos };
  }, [items, combos, selectedCategoryId, searchTerm]);

  // --- HANDLERS ---

  const handleProductClick = (item: MenuItem) => {
    const uiProduct = convertProductToUI(item);
    // Solo abrimos modal si NO es estándar
    if (uiProduct.behavior !== 'STANDARD') {
        setProductToConfig(uiProduct);
    } else {
        commands.addProductToCart(item);
    }
  };

  const handleComboClick = (combo: ComboDefinition) => {
      const uiCombo = convertComboToUI(combo);
      setProductToConfig(uiCombo);
  };

  const handleConfigComplete = (finalItem: { product: ProductUI, finalPrice: number, modifiers: any }) => {
    const cartItem = { ...finalItem.product, price: finalItem.finalPrice };
    commands.addProductToCart(cartItem, 1, "Configuración Personalizada"); 
  };

  // --- RENDER ---
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-[#FF5722] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0F0F0F] text-gray-100 overflow-hidden font-sans selection:bg-[#FF5722] selection:text-white relative">
      
      {/* COL 1: SIDEBAR CATEGORÍAS */}
      <nav className="w-[85px] md:w-[90px] lg:w-[110px] flex-shrink-0 flex flex-col items-center py-4 md:py-6 bg-[#161616] border-r border-[#2A2A2A] z-30 shadow-2xl h-full overflow-y-auto no-scrollbar scrollbar-hide">
        
        {/* Logo / Botón Home */}
        <div 
          className="mb-6 md:mb-8 p-2 md:p-3 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#D84315] shadow-lg shadow-orange-900/30 transform hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setSelectedCategoryId('all')}
        >
           {/* Icono Home */}
           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 w-full px-2 md:px-3 pb-6">
          <CategoryButton 
            id="all" 
            name="Todo" 
            isActive={selectedCategoryId === 'all'} 
            onClick={() => setSelectedCategoryId('all')} 
          />

          <CategoryButton 
            id="combos" 
            name="Combos" 
            isActive={selectedCategoryId === 'combos'} 
            onClick={() => setSelectedCategoryId('combos')} 
          />

          {categories?.map((cat) => (
            <CategoryButton 
              key={cat.id}
              id={String(cat.id)}
              name={cat.name}
              isActive={String(selectedCategoryId) === String(cat.id)}
              onClick={() => setSelectedCategoryId(String(cat.id))}
            />
          ))}
        </div>
      </nav>

      {/* COL 2: GRID DE PRODUCTOS */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0F0F0F] z-0">
        
        {/* Header */}
        <header className="h-16 md:h-20 min-h-[4rem] border-b border-[#2A2A2A] bg-[#161616]/95 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-20 sticky top-0 shadow-sm">
          <div className="hidden md:block">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Menú</h1>
          </div>
          
          <div className="relative group flex-1 md:flex-none max-w-md ml-auto">
            <input 
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 bg-[#0F0F0F] border border-[#333] rounded-xl py-2 md:py-2.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] transition-all"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3 md:top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </header>

        {/* Grid SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-[#333] z-0 pb-32 md:pb-8">
            <ProductGrid 
              products={filteredProducts}
              combos={filteredCombos}
              onProductClick={handleProductClick}
              onComboClick={handleComboClick}
            />
        </div>
      </main>

      {/* COL 3: CART SIDEBAR */}
      <div className="flex-shrink-0 z-30 h-full bg-[#161616] border-l border-[#2A2A2A]">
        <CartSidebar 
          cart={cart}
          onIncrease={(index) => commands.increaseQuantity(Number(index))}
          onDecrease={(index) => commands.decreaseQuantity(Number(index))}
          onRemove={(index) => commands.removeItem(Number(index))}
          onClear={commands.clearOrder}
          onProcess={() => setIsProcessModalOpen(true)}
        />
      </div>

      {/* MODALES */}
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
          const domainType = type === 'comer_aqui' ? 'mesa' : type;
          commands.submitOrder(domainType, meta).then(() => {
             if(cart.length === 0) setIsProcessModalOpen(false);
          });
        }}
      />
    </div>
  );
};

export default POSPage;