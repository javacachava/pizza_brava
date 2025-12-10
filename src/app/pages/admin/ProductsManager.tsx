import React, { useState, useEffect } from 'react';
import { MenuRepository } from '../../../repos/MenuRepository';
import { CategoryRepository } from '../../../repos/CategoryRepository';
import type { MenuItem } from '../../../models/MenuItem';
import type { Category } from '../../../models/Category';
import { DataTable } from './components/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../../contexts/AdminContext';

export const ProductsManager: React.FC = () => {
    const { setLoading, showNotification } = useAdmin();
    const [products, setProducts] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<MenuItem>>({});

    const menuRepo = new MenuRepository();
    const catRepo = new CategoryRepository();

    const loadData = async () => {
        setLoading(true);
        try {
            const [pData, cData] = await Promise.all([
                menuRepo.getAll(),
                catRepo.getAllOrdered()
            ]);
            setProducts(pData);
            setCategories(cData);
        } catch (error) {
            showNotification('error', 'Error cargando datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSave = async () => {
        if (!editingItem.name || !editingItem.price || !editingItem.categoryId) {
            showNotification('error', 'Nombre, Precio y Categoría obligatorios');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...editingItem,
                usesIngredients: editingItem.usesIngredients || false,
                usesFlavors: editingItem.usesFlavors || false,
                usesSizeVariant: editingItem.usesSizeVariant || false,
                comboEligible: editingItem.comboEligible ?? true,
                isAvailable: editingItem.isAvailable ?? true
            };

            if (editingItem.id) {
                await menuRepo.update(editingItem.id, payload);
                showNotification('success', 'Producto actualizado');
            } else {
                await menuRepo.create(payload as any);
                showNotification('success', 'Producto creado');
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            showNotification('error', 'Error guardando producto');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: MenuItem) => {
        setEditingItem({ ...item }); // Copia para evitar mutación directa
        setIsModalOpen(true);
    };

    const handleToggle = async (item: MenuItem) => {
        try {
            await menuRepo.update(item.id, { isAvailable: !item.isAvailable });
            loadData();
        } catch (error) {
            showNotification('error', 'Error cambiando disponibilidad');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Productos</h1>
                <Button onClick={() => { setEditingItem({}); setIsModalOpen(true); }}>+ Nuevo Producto</Button>
            </div>

            <DataTable 
                data={products}
                columns={[
                    { header: 'Nombre', accessor: 'name' },
                    { header: 'Precio ($)', accessor: (p) => p.price.toFixed(2) },
                    { header: 'Categoría', accessor: (p) => categories.find(c => c.id === p.categoryId)?.name || '---' },
                    { header: 'Config', accessor: (p) => (
                        <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                            {p.usesFlavors && '🍦Sabores '}
                            {p.comboEligible && '📦Combo '}
                        </div>
                    )},
                    { header: 'Disponible', accessor: (p) => p.isAvailable ? 'SÍ' : 'NO' }
                ]}
                onEdit={handleEdit}
                onToggleActive={handleToggle}
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingItem.id ? "Editar Producto" : "Nuevo Producto"}
                footer={
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Guardar</Button>
                    </div>
                }
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{display: 'block', fontSize: '0.9rem'}}>Nombre</label>
                        <input className="input-field" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                    </div>
                    
                    <div>
                        <label style={{display: 'block', fontSize: '0.9rem'}}>Precio ($)</label>
                        <input type="number" step="0.01" className="input-field" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                    </div>

                    <div>
                        <label style={{display: 'block', fontSize: '0.9rem'}}>Categoría</label>
                        <select className="input-field" value={editingItem.categoryId || ''} onChange={e => setEditingItem({...editingItem, categoryId: e.target.value})}>
                            <option value="">Seleccione...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{display: 'block', fontSize: '0.9rem'}}>Descripción (Opcional)</label>
                        <textarea className="input-field" style={{height: '60px'}} value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f7fafc', padding: '10px', borderRadius: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={editingItem.usesFlavors || false} onChange={e => setEditingItem({...editingItem, usesFlavors: e.target.checked})} />
                            Usa Sabores
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={editingItem.comboEligible ?? true} onChange={e => setEditingItem({...editingItem, comboEligible: e.target.checked})} />
                            Elegible para Combos
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={editingItem.usesIngredients || false} onChange={e => setEditingItem({...editingItem, usesIngredients: e.target.checked})} />
                            Usa Ingredientes Extra
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={editingItem.usesSizeVariant || false} onChange={e => setEditingItem({...editingItem, usesSizeVariant: e.target.checked})} />
                            Variante de Tamaño
                        </label>
                    </div>
                </div>
            </Modal>
        </div>
    );
};