import React, { useState } from 'react';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../../auth/hooks/usePermissions';
import { PermissionMatrix } from '../components/PermissionMatrix';
import { RoleModal } from '../components/RoleModal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { AlertPill } from '../../../components/ui/AlertPill';

export const RolesPage: React.FC = () => {
  const {
    roles,
    selectedRole,
    selectedRoleId,
    setSelectedRoleId,
    togglePermission,
    createRole,
    deleteRole,
    error,
    setError
  } = useRoles();

  const { canCreate, canUpdate, canDelete } = usePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdminRole = selectedRole.id === 'role-admin' || selectedRole.name.toLowerCase() === 'administrador';
  const canCreateRole = canCreate('roles');
  const canEditMatrix = canUpdate('roles') && !isAdminRole;
  const canDeleteRole = canDelete('roles') && !isAdminRole;

  const handleDelete = () => {
    if (isAdminRole) {
      setError('El rol Administrador del sistema está protegido y no se puede eliminar.');
      return;
    }
    if (!canDeleteRole) {
      setError('Tu rol no tiene permiso para eliminar roles.');
      return;
    }
    deleteRole(selectedRoleId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px] text-primary">admin_panel_settings</span>
            <h1 className="font-heading font-bold text-2xl text-dark-slate">Gestión de Roles y Permisos</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configura los accesos y matriz de permisos por módulo para el personal de la clínica.
          </p>
        </div>

        <Button
          icon="add"
          onClick={() => {
            if (canCreateRole) setIsModalOpen(true);
            else setError('Tu rol no tiene permiso para crear nuevos roles.');
          }}
          disabled={!canCreateRole}
          title={!canCreateRole ? 'Permiso de creación restringido' : 'Crear un nuevo rol'}
        >
          Nuevo Rol
        </Button>
      </div>

      {/* Error alert banner */}
      {error && (
        <AlertPill
          type="error"
          title={error}
          badgeText="RESTRICCIÓN"
          icon="block"
        />
      )}

      {/* Role Selection Tabs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {roles.map((role) => {
            const isSelected = role.id === selectedRoleId;
            return (
              <button
                key={role.id}
                onClick={() => {
                  setSelectedRoleId(role.id);
                  setError(null);
                }}
                className={`px-4 py-2.5 rounded-xl font-heading font-semibold text-sm transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{role.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {role.assignedUsersCount} usuarios
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Meta & Delete */}
        <div className="flex items-center gap-3">
          <Badge variant={selectedRole.assignedUsersCount > 0 ? 'primary' : 'slate'} icon="group">
            {selectedRole.assignedUsersCount} Usuario(s) Asignado(s)
          </Badge>

          <Button
            variant="danger"
            icon="delete"
            onClick={handleDelete}
            disabled={!canDeleteRole || selectedRole.assignedUsersCount > 0 || isAdminRole}
            title={
              isAdminRole
                ? 'El rol Administrador está protegido del sistema'
                : !canDeleteRole
                ? 'Permiso de eliminación restringido'
                : selectedRole.assignedUsersCount > 0
                ? 'No se puede eliminar un rol con usuarios asignados'
                : 'Eliminar este rol'
            }
          >
            Eliminar Rol
          </Button>
        </div>
      </div>

      {/* Role Info Summary */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 px-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-700 text-[24px]">
            {isAdminRole ? 'shield' : 'info'}
          </span>
          <div>
            <span className="font-bold text-emerald-900 text-sm">{selectedRole.name}: </span>
            <span className="text-sm text-emerald-800">{selectedRole.description}</span>
          </div>
        </div>
      </div>

      {/* Permission Matrix */}
      <PermissionMatrix
        role={selectedRole}
        onToggle={togglePermission}
        isReadOnly={!canEditMatrix}
      />

      {/* Modal para Crear Rol */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createRole}
      />
    </div>
  );
};
