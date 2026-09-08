import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { CreateRoleDTO } from '../types/role';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateRoleDTO) => boolean;
}

export const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('El nombre del rol es requerido.');
      return;
    }

    const success = onSubmit({ name, description });
    if (success) {
      setName('');
      setDescription('');
      setFormError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Rol de Sistema"
      subtitle="Define un nuevo rol con matriz de permisos configurable"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" icon="add" onClick={handleSubmit}>
            Crear Rol
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
          id="role-name"
          label="Nombre del Rol"
          placeholder="Ej. Asistente Técnico, Cirujano..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="role-desc" className="font-medium text-sm text-dark-slate">
            Descripción del Rol
          </label>
          <textarea
            id="role-desc"
            rows={3}
            className="w-full p-3 rounded-xl bg-surface-low border border-slate-200 text-dark-slate text-sm focus:outline-none focus:bg-white focus:border-primary transition-colors"
            placeholder="Describe las responsabilidades y alcance de este rol..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
