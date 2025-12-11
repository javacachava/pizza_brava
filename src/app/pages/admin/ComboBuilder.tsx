import React, { useState, useEffect } from 'react';
import { container } from '../../../models/di/container';
import type { ComboDefinition, ComboSlot } from '../../../models/ComboDefinition';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const ComboBuilder: React.FC = () => {
  const repo = container.comboDefRepo;
  const [list, setList] = useState<ComboDefinition[]>([]);
  const [editing, setEditing] = useState<Partial<ComboDefinition> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => { repo.getAll().then(setList).catch(console.error); }, []);

  const newSlot = (): ComboSlot => ({
    id: crypto.randomUUID(),
    name: '',
    required: 'required',
    min: 1,
    max: 1,
    allowedProductIds: []
  });

  const handleCreate = () => {
    setEditing({ name: '', basePrice: 0, slots: [] });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return alert('No hay combo a guardar.');
    if (!editing.name) return alert('El combo necesita un nombre.');
    if (!editing.slots || editing.slots.length === 0) return alert('Debe agregar al menos 1 slot.');

    try {
      if (editing.id) await repo.update(editing.id, editing);
      else await repo.create(editing as ComboDefinition);
      setIsOpen(false); setEditing(null);
      const updated = await repo.getAll();
      setList(updated);
      alert('Combo guardado correctamente');
    } catch (err) {
      console.error(err); alert('Error guardando combo');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Combos</h1>
        <Button onClick={handleCreate}>+ Nuevo Combo</Button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Button onClick={() => alert('Ver combos existentes - pendiente UI')}>Ver combos existentes</Button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing?.id ? 'Editar Combo' : 'Nuevo Combo'}>
        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Nombre del combo" />
            <input type="number" value={editing.basePrice ?? 0} onChange={e => setEditing({ ...editing, basePrice: parseFloat(e.target.value || '0') })} placeholder="Precio base" />
            <div>
              <h4>Slots</h4>
              {(editing.slots || []).map((s, idx) => (
                <div key={s.id} style={{ border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
                  <input value={s.name} onChange={e => {
                    const slots = [...(editing.slots || [])];
                    slots[idx] = { ...slots[idx], name: e.target.value };
                    setEditing({ ...editing, slots });
                  }} placeholder="Nombre del slot" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <label>
                      Requerido
                      <input type="checkbox" checked={s.required === 'required'} onChange={e => {
                        const slots = [...(editing.slots || [])];
                        slots[idx] = { ...slots[idx], required: e.target.checked ? 'required' : 'optional' };
                        setEditing({ ...editing, slots });
                      }} />
                    </label>
                    <label>
                      Min
                      <input type="number" value={s.min} onChange={e => {
                        const slots = [...(editing.slots || [])];
                        slots[idx] = { ...slots[idx], min: parseInt(e.target.value || '1') };
                        setEditing({ ...editing, slots });
                      }} />
                    </label>
                    <label>
                      Max
                      <input type="number" value={s.max} onChange={e => {
                        const slots = [...(editing.slots || [])];
                        slots[idx] = { ...slots[idx], max: parseInt(e.target.value || '1') };
                        setEditing({ ...editing, slots });
                      }} />
                    </label>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Button variant="outline" onClick={() => {
                      const slots = (editing.slots || []).filter((_, i) => i !== idx);
                      setEditing({ ...editing, slots });
                    }}>Eliminar slot</Button>
                  </div>
                </div>
              ))}
              <Button onClick={() => setEditing({ ...editing, slots: [...(editing.slots || []), newSlot()] })}>+ Agregar slot</Button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={handleSave}>Guardar Combo</Button>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancelar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
