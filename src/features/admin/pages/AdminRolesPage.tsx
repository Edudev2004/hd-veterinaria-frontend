import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield,
  Users,
  Stethoscope,
  Settings,
  Plus,
  X,
  Trash2,
  Loader2,
} from 'lucide-react';
import { adminRolesService, RoleDTO } from '../services/adminRolesService';

export const availablePermissions = [
  'Gestionar propietarios',
  'Gestionar mascotas',
  'Gestionar citas',
  'Gestionar veterinarios',
  'Gestionar especialidades',
  'Gestionar roles y permisos',
  'Consultar reportes',
];

const PROTECTED_ROLES = ['PROPIETARIO', 'VETERINARIO', 'ADMIN', 'ROLE_PROPIETARIO', 'ROLE_VETERINARIO', 'ROLE_ADMIN'];

const getRoleIcon = (roleName: string) => {
  const normalized = roleName.toUpperCase();
  if (normalized.includes('PROPIETARIO') || normalized.includes('OWNER')) {
    return <Users size={24} />;
  }
  if (normalized.includes('VETERINARIO') || normalized.includes('VET')) {
    return <Stethoscope size={24} />;
  }
  if (normalized.includes('ADMIN')) {
    return <Settings size={24} />;
  }
  return <Shield size={24} />;
};

export const AdminRolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const cargarRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRolesService.listar();
      // Ocultar rol redundante ROLE_OWNER para mantener solo ROLE_PROPIETARIO
      setRoles(data.filter((r) => r.name !== 'ROLE_OWNER' && r.name !== 'OWNER'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los roles.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarRoles();
  }, [cargarRoles]);

  const togglePermission = async (role: RoleDTO, permission: string) => {
    const hasPermission = (role.permissions || []).includes(permission);
    const updatedPermissions = hasPermission
      ? role.permissions.filter((p) => p !== permission)
      : [...(role.permissions || []), permission];

    try {
      const updated = await adminRolesService.actualizar(role.id, {
        name: role.name,
        description: role.description || '',
        permissions: updatedPermissions,
      });
      setRoles((prev) => prev.map((r) => (r.id === role.id ? updated : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar permisos.');
    }
  };

  const toggleSelectedPermission = (permission: string) => {
    setSelectedPermissions((current) =>
      current.includes(permission)
        ? current.filter((p) => p !== permission)
        : [...current, permission]
    );
  };

  const resetForm = () => {
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions([]);
    setIsFormOpen(false);
  };

  const handleCreateRole = async () => {
    if (!roleName.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await adminRolesService.crear({
        name: roleName.trim().toUpperCase(),
        description: roleDescription.trim(),
        permissions: selectedPermissions,
      });
      setRoles((prev) => [...prev, created]);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al crear el rol.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (PROTECTED_ROLES.includes(roleName.toUpperCase())) {
      alert('Los roles base del sistema no pueden ser eliminados.');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el rol "${roleName}"?`)) return;

    try {
      await adminRolesService.eliminar(roleId);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el rol.');
    }
  };

  const isRoleCustom = (name: string) => !PROTECTED_ROLES.includes(name.toUpperCase());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de Roles y Permisos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Administración de roles y control de accesos del sistema
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          <Plus size={18} />
          Nuevo rol
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
          <button
            type="button"
            onClick={() => void cargarRoles()}
            className="ml-2 font-bold underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Crear rol personalizado
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Define el nombre, descripción y permisos del nuevo rol.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              aria-label="Cerrar formulario"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="roleName"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Nombre del rol
              </label>
              <input
                id="roleName"
                type="text"
                value={roleName}
                onChange={(event) => setRoleName(event.target.value)}
                placeholder="Ej. RECEPCIONISTA"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="roleDescription"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Descripción
              </label>
              <input
                id="roleDescription"
                type="text"
                value={roleDescription}
                onChange={(event) => setRoleDescription(event.target.value)}
                placeholder="Describe las funciones del rol"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-slate-400"
              />
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Seleccionar permisos
            </h3>

            <div className="grid gap-2 md:grid-cols-2">
              {availablePermissions.map((permission) => {
                const isSelected = selectedPermissions.includes(permission);
                return (
                  <button
                    key={permission}
                    type="button"
                    onClick={() => toggleSelectedPermission(permission)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                      isSelected
                        ? 'border-green-200 bg-green-50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm text-slate-600">
                      {permission}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? 'text-green-700' : 'text-slate-400'
                      }`}
                    >
                      {isSelected ? 'Seleccionado' : 'Seleccionar'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => void handleCreateRole()}
              disabled={!roleName.trim() || isSubmitting}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Creando...' : 'Crear rol'}
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="mb-4">
          <h2 className="font-bold text-slate-800">
            Roles del sistema
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Consulta los roles disponibles y su configuración.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const custom = isRoleCustom(role.name);
              return (
                <div
                  key={role.id}
                  className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        {getRoleIcon(role.name)}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            custom
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {custom ? 'Personalizado' : 'Rol del sistema'}
                        </span>

                        {custom && (
                          <button
                            type="button"
                            onClick={() => void handleDeleteRole(role.id, role.name)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Eliminar rol"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-bold text-slate-800">{role.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {role.description || 'Sin descripción'}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Permisos asignados:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {availablePermissions.map((permission) => {
                          const assigned = (role.permissions || []).includes(permission);
                          return (
                            <button
                              key={permission}
                              type="button"
                              onClick={() => void togglePermission(role, permission)}
                              className={`text-[11px] px-2 py-1 rounded-md border transition ${
                                assigned
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium'
                                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              {assigned ? '✓ ' : '+ '} {permission}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
