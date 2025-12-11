import React, { useEffect, useState } from 'react';
import { container } from '../../../models/di/container';
import type { Rule } from '../../../models/Rules';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const RulesManager: React.FC = () => {
  const adminService = container.adminService;
  const [rules, setRules] = useState<Rule[]>([]);
  const [editing, setEditing] = useState<Partial<Rule> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    try {
      const r = await adminService.getRules();
      setRules(r);
    } catch (e) {
      console.error(e); alert('Error cargando reglas');
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    try {
      await adminService.saveRule(editing);
      await load();
      setOpen(false); setEditing(null);
      alert('Regla guardada');
    } catch (e) {
      console.error(e); alert('Error guardando regla');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1>Reglas Globales</h1>
        <Button onClick={() => { setEditing({}); setOpen(true); }}>+ Nueva Regla</Button>
      </div>

      <DataTable data={rules} columns={[
        { header: 'Clave', accessor: 'key' },
        { header: 'Valor', accessor: (r: Rule) => JSON.stringify(r.value) },
        { header: 'Descripción', accessor: 'description' }
      ]} onEdit={(r) => { setEditing(r); setOpen(true); }} />

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Regla">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Clave (ej: taxRate)" value={editing?.key || ''} onChange={e => setEditing({ ...(editing||{}), key: e.target.value })} />
          <textarea placeholder="Valor (JSON)" value={editing?.value ? JSON.stringify(editing.value) : ''} onChange={e => {
            try {
              const parsed = JSON.parse(e.target.value);
              setEditing({ ...(editing||{}), value: parsed });
            } catch {
              setEditing({ ...(editing||{}), value: e.target.value });
            }
          }} />
          <input placeholder="Descripción" value={editing?.description || ''} onChange={e => setEditing({ ...(editing||{}), description: e.target.value })} />
          <Button onClick={save}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
};
