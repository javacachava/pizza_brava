import React, { useEffect, useState } from 'react';
import { UsersAdminService } from '../../../services/domain/UsersAdminService';
import type { User, UserRole } from '../../../models/User';
import { DataTable } from './components/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../../contexts/AdminContext';

export const UsersManager: React.FC = () => {
    const { setLoading, showNotification } = useAdmin();
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const service = new UsersAdminService();

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'waiter' as UserRole
    });

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await service.getAllUsers();
            setUsers(data);
        } catch (error) {
            showNotification('error', 'Error cargando usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreate = async () => {
        if (!formData.email || !formData.password || !formData.name) {
            showNotification('error', 'Todos los campos son obligatorios');
            return;
        }

        setLoading(true);
        try {
            await service.createUser(formData);
            showNotification('success', 'Usuario creado correctamente');
            setIsModalOpen(false);
            setFormData({ email: '', password: '', name: '', role: 'waiter' });
            loadUsers();
        } catch (error: any) {
            showNotification('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user: User) => {
        try {
            await service.toggleUserStatus(user);
            showNotification('success', `Usuario ${user.isActive ? 'desactivado' : 'activado'}`);
            loadUsers();
        } catch (error) {
            showNotification('error', 'Error actualizando estado');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Gestión de Usuarios</h1>
                <Button onClick={() => setIsModalOpen(true)}>+ Nuevo Usuario</Button>
            </div>

            <DataTable 
                data={users}
                columns={[
                    { header: 'Nombre', accessor: 'name' },
                    { header: 'Email', accessor: 'email' },
                    { header: 'Rol', accessor: (u) => <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>{u.role}</span> },
                    { header: 'Estado', accessor: (u) => u.isActive ? 'Activo' : 'Inactivo' }
                ]}
                onToggleActive={handleToggleStatus}
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Crear Nuevo Usuario"
                footer={
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreate}>Crear Usuario</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        className="input-field" 
                        placeholder="Nombre Completo" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                        className="input-field" 
                        type="email"
                        placeholder="Correo Electrónico" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        className="input-field" 
                        type="password"
                        placeholder="Contraseña" 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <select 
                        className="input-field"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                    >
                        <option value="waiter">Mesero (Waiter)</option>
                        <option value="cashier">Cajero (Cashier)</option>
                        <option value="kitchen">Cocina (Kitchen)</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
            </Modal>
        </div>
    );
};