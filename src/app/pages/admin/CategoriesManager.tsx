import React, { useEffect, useState } from 'react';
import { container } from '../../../models/di/container';
import type { Category } from '../../../models/Category';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const CategoriesManager: React.FC = () => {
  const repo = container.categoryRepo;
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<Category>>({});
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await repo.getAllOrdered();
      setCategories(data);
    } catch (e) {
      console.error(e);
      alert('Error cargando categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const handleSave = async () => {
    if (!editingCat.name || editingCat.order == null) {
      alert('Nombre y Orden son obligatorios');
      return;
    }
    setLoading(true);
    try {
      if (editingCat.id) {
        await repo.update(editingCat.id, editingCat as Partial<Category>);
      } else {
        await repo.create({ ...(editingCat as Category), isActive: true });
      }
      setIsModalOpen(false);
      await loadCategories();
      alert('Categoría guardada');
    } catch (e) {
      console.error(e);
      alert('Error guardando categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (cat: Category) => {
    try {
      await repo.update(cat.id, { isActive: !cat.isActive });
      await loadCategories();
    } catch (e) {
      console.error(e);
      alert('Error cambiando estado');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Categorías</h1>
        <Button onClick={() => { setEditingCat({ order: categories.length + 1 }); setIsModalOpen(true); }}>+ Nueva Categoría</Button>
      </div>

      <DataTable
        data={categories}
        columns={[
          { header: 'Orden', accessor: 'order', width: '80px' },
          { header: 'Nombre', accessor: 'name' },
          { header: 'Estado', accessor: (c: Category) => c.isActive ? 'Activa' : 'Inactiva' }
        ]}
        onEdit={(c: Category) => { setEditingCat(c); setIsModalOpen(true); }}
        onToggleActive={handleToggle}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCat.id ? 'Editar Categoría' : 'Nueva Categoría'}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label>Nombre</label>
            <input className="input-field" value={editingCat.name || ''} onChange={e => setEditingCat({ ...editingCat, name: e.target.value })} />
          </div>
          <div>
            <label>Orden Visual</label>
            <input type="number" className="input-field" value={editingCat.order ?? ''} onChange={e => setEditingCat({ ...editingCat, order: parseInt(e.target.value || '0') })} />
          </div>
        </div>
      </Modal>
    </div>
  );
};
