import React, { useEffect, useState } from 'react';
import { container } from '../../../models/di/container';
import type { MenuItem } from '../../../models/MenuItem';
import type { Category } from '../../../models/Category';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const ProductsManager: React.FC = () => {
  const menuRepo = container.menuRepo;
  const catRepo = container.categoryRepo;
  const productsService = container.productsAdminService;

  const [products, setProducts] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem>>({});
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([menuRepo.getAll(), catRepo.getAllOrdered()]);
      setProducts(pData);
      setCategories(cData);
    } catch (e) {
      console.error(e);
      alert('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await productsService.save(editingItem);
      setIsModalOpen(false);
      setEditingItem({});
      await loadData();
      alert('Producto guardado');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Error guardando producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleToggle = async (item: MenuItem) => {
    try {
      await menuRepo.update(item.id, { isAvailable: !item.isAvailable });
      await loadData();
    } catch (e) {
      console.error(e);
      alert('Error cambiando disponibilidad');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Productos</h1>
        <Button onClick={() => { setEditingItem({}); setIsModalOpen(true); }}>+ Nuevo Producto</Button>
      </div>

      <DataTable
        data={products}
        columns={[
          { header: 'Nombre', accessor: 'name' },
          { header: 'Precio ($)', accessor: (p: MenuItem) => (p.price ?? 0).toFixed(2) },
          { header: 'Categoría', accessor: (p: MenuItem) => categories.find(c => c.id === p.categoryId)?.name || '—' },
          { header: 'Disponible', accessor: (p: MenuItem) => p.isAvailable ? 'SÍ' : 'NO' }
        ]}
        onEdit={handleEdit}
        onToggleActive={handleToggle}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Editar Producto' : 'Nuevo Producto'}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Nombre</label>
            <input className="input-field" value={editingItem.name || ''} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
          </div>

          <div>
            <label>Precio ($)</label>
            <input type="number" step="0.01" className="input-field" value={editingItem.price ?? ''} onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value || '0') })} />
          </div>

          <div>
            <label>Categoría</label>
            <select className="input-field" value={editingItem.categoryId || ''} onChange={e => setEditingItem({ ...editingItem, categoryId: e.target.value })}>
              <option value="">Seleccione...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label>Descripción</label>
            <textarea className="input-field" value={editingItem.description || ''} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            <label><input type="checkbox" checked={editingItem.usesFlavors || false} onChange={e => setEditingItem({ ...editingItem, usesFlavors: e.target.checked })} /> Usa Sabores</label>
            <label><input type="checkbox" checked={editingItem.comboEligible ?? true} onChange={e => setEditingItem({ ...editingItem, comboEligible: e.target.checked })} /> Elegible para Combo</label>
            <label><input type="checkbox" checked={editingItem.usesIngredients || false} onChange={e => setEditingItem({ ...editingItem, usesIngredients: e.target.checked })} /> Usa Ingredientes</label>
            <label><input type="checkbox" checked={editingItem.usesSizeVariant || false} onChange={e => setEditingItem({ ...editingItem, usesSizeVariant: e.target.checked })} /> Variante de Tamaño</label>
          </div>
        </div>
      </Modal>
    </div>
  );
};
