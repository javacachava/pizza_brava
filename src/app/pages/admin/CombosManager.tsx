import React, { useEffect, useState } from 'react';
import { container } from '../../../models/di/container';
import type { ComboDefinition, ComboSlot } from '../../../models/ComboDefinition';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const CombosManager: React.FC = () => {
  const comboDefRepo = container.comboDefRepo;
  const comboService = container.comboService;

  const [combos, setCombos] = useState<ComboDefinition[]>([]);
  const [editing, setEditing] = useState<Partial<ComboDefinition> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    try {
      const all = await comboDefRepo.getAll();
      setCombos(all);
    } catch (e) {
      console.error(e);
      alert('Error cargando combos');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createEmptySlot = (): ComboSlot => ({
    id: crypto.randomUUID(),
    name: '',
    required: 'required',
    min: 1,
    max: 1,
    allowedProductIds: []
  });

  const save = async () => {
    try {
      if (!editing) return;

      if (editing.id) {
        await comboService.updateDefinition(editing.id, editing);
      } else {
        await comboService.createDefinition(editing);
      }

      await load();
      setOpen(false);
      setEditing(null);
      alert('Combo guardado');
    } catch (e) {
      console.error(e);
      alert('Error guardando combo');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1>Combos</h1>

        {/* FIX: usar slots en lugar de groups */}
        <Button
          onClick={() => {
            setEditing({
              name: '',
              description: '',
              basePrice: 0,
              isActive: true,
              slots: []
            });
            setOpen(true);
          }}
        >
          + Nuevo Combo
        </Button>
      </div>

      <DataTable
        data={combos}
        columns={[
          { header: 'Nombre', accessor: 'name' },
          {
            header: 'Precio Base',
            accessor: (c: ComboDefinition) => `$${(c.basePrice || 0).toFixed(2)}`
          },
          {
            header: 'Slots',
            accessor: (c: ComboDefinition) => (c.slots?.length || 0)
          }
        ]}
        onEdit={(c: ComboDefinition) => {
          setEditing(c);
          setOpen(true);
        }}
        onToggleActive={(c: ComboDefinition) =>
          comboDefRepo.update(c.id, { isActive: !c.isActive })
        }
      />

      {/* FIX: protegemos editing para evitar errores de null */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={editing && editing.id ? 'Editar Combo' : 'Nuevo Combo'}
      >
        {!editing ? null : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              placeholder="Nombre"
              value={editing.name || ''}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Precio Base"
              value={editing.basePrice ?? ''}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  basePrice: parseFloat(e.target.value || '0')
                })
              }
            />

            <textarea
              placeholder="Descripción"
              value={editing.description || ''}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />

            <div>
              <strong>Slots</strong>

              {(editing.slots || []).map((s, idx) => (
                <div
                  key={s.id || idx}
                  style={{ border: '1px solid #eee', padding: 8, marginBottom: 8 }}
                >
                  {/* Título del slot */}
                  <input
                    placeholder="Título"
                    value={s.name}
                    onChange={(e) => {
                      const slots = [...(editing.slots || [])];
                      slots[idx] = { ...slots[idx], name: e.target.value };
                      setEditing({ ...editing, slots });
                    }}
                  />

                  {/* Configuración de restricciones */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={s.required === 'required'}
                        onChange={(e) => {
                          const slots = [...(editing.slots || [])];
                          slots[idx] = {
                            ...slots[idx],
                            required: e.target.checked ? 'required' : 'optional'
                          };
                          setEditing({ ...editing, slots });
                        }}
                      />
                      Requerido
                    </label>

                    <input
                      type="number"
                      value={s.min ?? 1}
                      onChange={(e) => {
                        const slots = [...(editing.slots || [])];
                        slots[idx] = {
                          ...slots[idx],
                          min: parseInt(e.target.value || '1')
                        };
                        setEditing({ ...editing, slots });
                      }}
                      style={{ width: 80 }}
                    />

                    <input
                      type="number"
                      value={s.max ?? 1}
                      onChange={(e) => {
                        const slots = [...(editing.slots || [])];
                        slots[idx] = {
                          ...slots[idx],
                          max: parseInt(e.target.value || '1')
                        };
                        setEditing({ ...editing, slots });
                      }}
                      style={{ width: 80 }}
                    />
                  </div>

                  {/* Lista de productos permitidos */}
                  <div style={{ marginTop: 8 }}>
                    <input
                      style={{ width: '100%' }}
                      placeholder="Allowed product IDs (CSV)"
                      value={(s.allowedProductIds || []).join(',')}
                      onChange={(e) => {
                        const ids = e.target.value
                          .split(',')
                          .map((x) => x.trim())
                          .filter(Boolean);

                        const slots = [...(editing.slots || [])];
                        slots[idx] = { ...slots[idx], allowedProductIds: ids };
                        setEditing({ ...editing, slots });
                      }}
                    />
                  </div>
                </div>
              ))}

              <Button
                onClick={() => {
                  const slots = [...(editing.slots || [])];
                  slots.push(createEmptySlot());
                  setEditing({ ...editing, slots });
                }}
              >
                + Agregar slot
              </Button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={save}>Guardar Combo</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
