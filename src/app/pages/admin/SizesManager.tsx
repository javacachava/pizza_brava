import React, { useEffect, useState } from 'react';
import { container } from '../../../models/di/container';
import type { Size } from '../../../models/Size';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const SizesManager: React.FC = () => {
  const repo = container.sizesRepo;
  const [data, setData] = useState<Size[]>([]);
  const [edit, setEdit] = useState<Partial<Size> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => setData(await repo.getAllOrdered());
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!edit) return;
    try {
      if (edit.id) await repo.update(edit.id, edit);
      else await repo.create({ ...(edit as Size), name: edit.name || 'Nuevo', multiplier: edit.multiplier ?? 1 });
      await load();
      setOpen(false); setEdit(null);
      alert('Tamaño guardado');
    } catch (e) {
      console.error(e); alert('Error guardando tamaño');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1>Tamaños</h1>
        <Button onClick={() => { setEdit({}); setOpen(true); }}>+ Nuevo</Button>
      </div>

      <DataTable data={data} columns={[{ header: 'Nombre', accessor: 'name' }, { header: 'Multiplicador', accessor: (i: Size) => i.multiplier }]} onEdit={(i) => { setEdit(i); setOpen(true); }} onToggleActive={(i) => repo.update(i.id, { isActive: !i.isActive })} />

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Tamaño">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Nombre" value={edit?.name || ''} onChange={e => setEdit({ ...(edit || {}), name: e.target.value })} />
          <input type="number" placeholder="Multiplicador" value={edit?.multiplier ?? 1} onChange={e => setEdit({ ...(edit || {}), multiplier: parseFloat(e.target.value || '1') })} />
          <Button onClick={save}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
};
