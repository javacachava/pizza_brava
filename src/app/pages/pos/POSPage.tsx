import React, { useState, useMemo } from 'react';
import { useMenu } from '../../../hooks/useMenu';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductGrid } from './components/ProductGrid';
import { CartSidebar } from './components/CartSidebar';
import { ProductDetailModal } from './components/ProductDetailModal';
import type { MenuItem } from '../../../models/MenuItem';
import { useAuth } from '../../../hooks/useAuth';

export const POSPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { categories, isLoading } = useMenu();
    
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

    const filteredProducts = useMemo(() => {
        let items: MenuItem[] = [];
        categories.forEach(cat => {
            const catItems = cat.items.filter(p => p.isAvailable);
            items.push(...catItems);
        });

        if (selectedCategoryId !== 'ALL') {
            items = items.filter(p => p.categoryId === selectedCategoryId);
        }
        if (searchQuery.trim()) {
            const lowerQ = searchQuery.toLowerCase();
            items = items.filter(p => p.name.toLowerCase().includes(lowerQ));
        }

        return items;
    }, [categories, selectedCategoryId, searchQuery]);

    const handleProductClick = (product: MenuItem) => {
        setSelectedProduct(product);
    };

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: '#718096' }}>Cargando Menú...</div>;
    }

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f7fafc' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0' }}>
                <div style={{ padding: '15px 20px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                        <h2 style={{ margin: 0, color: '#ff6b00' }}>Pizza Brava POS</h2>
                        <input 
                            type="text" 
                            placeholder="🔍 Buscar producto (nombre)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '10px', borderRadius: '20px', border: '1px solid #cbd5e0', width: '300px', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 'bold', color: '#4a5568' }}>{user?.name}</span>
                        <button onClick={logout} style={{ border: '1px solid #fc8181', color: '#fc8181', background: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Salir</button>
                    </div>
                </div>

                <div style={{ padding: '0 20px', backgroundColor: 'white' }}>
                    <CategoryTabs 
                        categories={categories} 
                        selectedId={selectedCategoryId} 
                        onSelect={setSelectedCategoryId} 
                    />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f7fafc' }}>
                    {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: '#a0aec0' }}>No se encontraron productos.</div>
                    ) : (
                        <ProductGrid products={filteredProducts} onProductClick={handleProductClick} />
                    )}
                </div>
            </div>

            <div style={{ width: '400px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', boxShadow: '-2px 0 10px rgba(0,0,0,0.05)', zIndex: 10 }}>
                <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fffaf0' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ed8936', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📝</span> Orden Actual
                    </h2>
                </div>
                <div style={{ flex: 1, padding: '15px', overflow: 'hidden' }}>
                    <CartSidebar />
                </div>
            </div>

            <ProductDetailModal 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
            />
        </div>
    );
};
