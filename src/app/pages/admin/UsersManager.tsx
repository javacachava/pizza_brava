import React, { useEffect, useState } from 'react';
import { container } from '../../../models/di/container';
import type { User, UserRole } from '../../../models/User';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const UsersManager: React.FC = () => {
  const usersService = container.usersAdminService;
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'waiter' as UserRole
  });

  const loadUsers = async () => {
    try {
      const data = await usersService.getAllUsers();
      setUsers(data);
    } catch (e) {
      console.error(e); alert('Error cargando usuarios');
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      alert('Todos los campos son obligatorios');
      return;
    }
    try {
      await usersService.createUser(formData);
      setIsModalOpen(false);
      setFormData({ email: '', password: '', name: '', role: 'recepcion' });
      await loadUsers();
      alert('Usuario creado');
    } catch (e: any) {
      console.error(e); alert(e?.message || 'Error creando usuario');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await usersService.toggleUserStatus(user);
      await loadUsers();
      alert('Estado actualizado');
    } catch (e) {
      console.error(e); alert('Error actualizando estado');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Gestión de Usuarios</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Nuevo Usuario</Button>
      </div>

      <DataTable data={users}
        columns={[
          { header: 'Nombre', accessor: 'name' },
          { header: 'Email', accessor: 'email' },
          { header: 'Rol', accessor: (u: User) => <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>{u.role}</span> },
          { header: 'Estado', accessor: (u: User) => u.isActive ? 'Activo' : 'Inactivo' }
        ]}
        onToggleActive={handleToggleStatus}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Usuario"
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Crear Usuario</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input className="input-field" placeholder="Nombre Completo" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input className="input-field" type="email" placeholder="Correo Electrónico" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          <input className="input-field" type="password" placeholder="Contraseña" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          <select className="input-field" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}>
            <option value="recepcion">Recepcion</option>
            <option value="cocina">Cocina</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};
