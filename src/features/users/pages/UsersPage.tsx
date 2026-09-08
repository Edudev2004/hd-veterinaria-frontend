import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserListTable } from '../components/UserListTable';
import { UserModal } from '../components/UserModal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { AlertPill } from '../../../components/ui/AlertPill';
import { UserProfile, CreateUserDTO } from '../types/user';

export const UsersPage: React.FC = () => {
  const {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    createUser,
    updateUser,
    toggleUserStatus,
    error,
    setError
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setError(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (dto: CreateUserDTO, roleName: string): boolean => {
    if (editingUser) {
      return updateUser(editingUser.id, dto, roleName);
    } else {
      return createUser(dto, roleName);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px] text-primary">badge</span>
            <h1 className="font-heading font-bold text-2xl text-dark-slate">Gestión de Usuarios del Sistema</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Administra los usuarios del personal médico y administrativo de la veterinaria.
          </p>
        </div>

        <Button icon="person_add" onClick={handleOpenCreateModal}>
          Registrar Usuario
        </Button>
      </div>

      {/* Error alert banner */}
      {error && (
        <AlertPill
          type="error"
          title={error}
          badgeText="ALERTA"
          icon="warning"
        />
      )}

      {/* Metric Counters & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Personal</div>
            <div className="font-heading font-bold text-2xl text-dark-slate mt-0.5">{users.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Usuarios Activos</div>
            <div className="font-heading font-bold text-2xl text-emerald-600 mt-0.5">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Desactivados (Soft Delete)</div>
            <div className="font-heading font-bold text-2xl text-amber-600 mt-0.5">{inactiveCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">pause_circle</span>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-center gap-1">
          <label htmlFor="role-filter" className="text-xs text-slate-400 font-medium">Filtrar por Rol</label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full h-8 px-2 rounded-lg bg-surface-low text-xs font-semibold text-dark-slate focus:outline-none focus:border-primary border border-slate-200"
          >
            <option value="ALL">Todos los Roles ({users.length})</option>
            <option value="role-admin">Administradores</option>
            <option value="role-vet">Veterinarios</option>
            <option value="role-recep">Recepcionistas</option>
          </select>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <Input
          id="search-user"
          label=""
          icon="search"
          placeholder="Buscar usuario por nombre o correo electrónico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* User List Table */}
      <UserListTable
        users={filteredUsers}
        onEdit={handleOpenEditModal}
        onToggleStatus={toggleUserStatus}
      />

      {/* Modal para Crear/Editar Usuario */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingUser={editingUser}
      />
    </div>
  );
};
