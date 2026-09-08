import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { UserProfile, CreateUserDTO } from '../types/user';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateUserDTO, roleName: string) => boolean;
  editingUser?: UserProfile | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingUser
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('role-vet');
  const [formError, setFormError] = useState<string | null>(null);

  const availableRoles = [
    { id: 'role-admin', name: 'Administrador' },
    { id: 'role-vet', name: 'Veterinario' },
    { id: 'role-recep', name: 'Recepcionista' }
  ];

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRoleId(editingUser.roleId);
    } else {
      setName('');
      setEmail('');
      setRoleId('role-vet');
    }
    setFormError(null);
  }, [editingUser, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('El nombre completo es requerido.');
      return;
    }
    if (!email.trim()) {
      setFormError('El correo electrónico es requerido.');
      return;
    }

    const selectedRole = availableRoles.find((r) => r.id === roleId);
    const roleName = selectedRole ? selectedRole.name : 'Usuario';

    const success = onSubmit({ name, email, roleId }, roleName);
    if (success) {
      setName('');
      setEmail('');
      setFormError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
      subtitle={editingUser ? 'Actualiza la información del miembro del personal' : 'Asigna nombre, correo y rol al personal de la clínica'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" icon={editingUser ? 'save' : 'person_add'} onClick={handleSubmit}>
            {editingUser ? 'Guardar Cambios' : 'Registrar Usuario'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {formError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {formError}
          </div>
        )}

        <Input
          id="user-name"
          label="Nombre Completo"
          icon="person"
          placeholder="Ej. Dra. Camila Torres"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          id="user-email"
          label="Correo Electrónico (Único)"
          icon="mail"
          type="email"
          placeholder="camila.vet@veterinariahd.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-role" className="font-medium text-sm text-dark-slate">
            Rol en el Sistema
          </label>
          <select
            id="user-role"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-surface-low border border-slate-200 text-dark-slate text-sm focus:outline-none focus:bg-white focus:border-primary transition-colors"
          >
            {availableRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};
