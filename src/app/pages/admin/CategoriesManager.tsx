import React, { useState, useEffect } from 'react';
import { CategoryRepository } from '../../../repos/CategoryRepository';
import type { Category } from '../../../models/Category';
import { DataTable } from './components/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../../contexts/AdminContext';

export const CategoriesManager: React.FC = () => {
    const { setLoading, showNotification } = useAdmin();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<Partial<Category>>({});
    
    const repo = new CategoryRepository();

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await repo.getAllOrdered();
            setCategories(data);
        } catch (error) {
            showNotification('error', 'Error cargando categorías');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadCategories(); }, []);

    const handleSave = async () => {
        if (!editingCat.name || !editingCat.order) {
            showNotification('error', 'Nombre y Orden son obligatorios');
            return;
        }

        setLoading(true);
        try {
            if (editingCat.id) {
                await repo.update(editingCat.id, editingCat);
                showNotification('success', 'Categoría actualizada');
            } else {
                await repo.create({
                    name: editingCat.name,
                    order: editingCat.order,
                    isActive: true
                } as any);
                showNotification('success', 'Categoría creada');
            }
            setIsModalOpen(false);
            loadCategories();
        } catch (error) {
            showNotification('error', 'Error guardando categoría');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cat: Category) => {
        setEditingCat(cat);
        setIsModalOpen(true);
    };

    const handleToggle = async (cat: Category) => {
        try {
            await repo.update(cat.id, { isActive: !cat.isActive });
            loadCategories(); // Refrescamos para ver el cambio
        } catch (error) {
            showNotification('error', 'Error cambiando estado');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Categorías</h1>
                <Button onClick={() => { setEditingCat({ order: categories.length + 1 }); setIsModalOpen(true); }}>+ Nueva Categoría</Button>
            </div>

            <DataTable 
                data={categories}
                columns={[
                    { header: 'Orden', accessor: 'order', width: '80px' },
                    { header: 'Nombre', accessor: 'name' },
                    { header: 'Estado', accessor: (c) => c.isActive ? 'Activa' : 'Inactiva' }
                ]}
                onEdit={handleEdit}
                onToggleActive={handleToggle}
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingCat.id ? "Editar Categoría" : "Nueva Categoría"}
                footer={
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Guardar</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '5px'}}>Nombre</label>
                        <input 
                            className="input-field" 
                            value={editingCat.name || ''} 
                            onChange={e => setEditingCat({...editingCat, name: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '5px'}}>Orden Visual</label>
                        <input 
                            type="number"
                            className="input-field" 
                            value={editingCat.order || ''} 
                            onChange={e => setEditingCat({...editingCat, order: parseInt(e.target.value)})} 
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};