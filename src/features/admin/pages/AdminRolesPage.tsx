import React, { useState } from 'react';
import { Shield, Users, Stethoscope, Settings, Plus, X } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
}

export const availablePermissions = [
  'Gestionar propietarios',
  'Gestionar mascotas',
  'Gestionar citas',
  'Gestionar veterinarios',
  'Gestionar especialidades',
  'Gestionar roles y permisos',
  'Consultar reportes',
];

export const initialRoles: Role[] = [
  {
    id: '1',
    name: 'PROPIETARIO',
    description: 'Usuario propietario de mascotas.',
    permissions: [],
    isCustom: false,
  },
  {
    id: '2',
    name: 'VETERINARIO',
    description: 'Profesional encargado de la atención veterinaria.',
    permissions: [],
    isCustom: false,
  },
  {
    id: '3',
    name: 'ADMIN',
    description: 'Administrador del sistema.',
    permissions: [],
    isCustom: false,
  },
];

const getRoleIcon = (roleName: string) => {
  switch (roleName) {
    case 'PROPIETARIO':
      return <Users size={24} />;
    case 'VETERINARIO':
      return <Stethoscope size={24} />;
    case 'ADMIN':
      return <Settings size={24} />;
    default:
      return <Shield size={24} />;
  }
};

export const AdminRolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (roleId: string, permission: string) => {
    setRoles((currentRoles) =>
      currentRoles.map((role) => {
        if (role.id !== roleId) {
          return role;
        }

        const hasPermission = role.permissions.includes(permission);

        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(
                (currentPermission) => currentPermission !== permission
              )
            : [...role.permissions, permission],
        };
      })
    );
  };

  const toggleSelectedPermission = (permission: string) => {
    setSelectedPermissions((currentPermissions) =>
      currentPermissions.includes(permission)
        ? currentPermissions.filter(
            (currentPermission) => currentPermission !== permission
          )
        : [...currentPermissions, permission]
    );
  };

  const resetForm = () => {
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions([]);
    setIsFormOpen(false);
  };

  const handleCreateRole = () => {
    if (!roleName.trim()) {
      return;
    }

    const newRole: Role = {
      id: Date.now().toString(),
      name: roleName.trim(),
      description: roleDescription.trim(),
      permissions: selectedPermissions,
      isCustom: true,
    };

    setRoles((currentRoles) => [...currentRoles, newRole]);
    resetForm();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de Roles y Permisos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Administración de roles y permisos del sistema
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

      {isFormOpen && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
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
                onChange={(event) =>
                  setRoleDescription(event.target.value)
                }
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
                const isSelected =
                  selectedPermissions.includes(permission);

                return (
                  <button
                    key={permission}
                    type="button"
                    onClick={() =>
                      toggleSelectedPermission(permission)
                    }
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
                        isSelected
                          ? 'text-green-700'
                          : 'text-slate-400'
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
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleCreateRole}
              disabled={!roleName.trim()}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Crear rol
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  {getRoleIcon(role.name)}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    role.isCustom
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {role.isCustom ? 'Personalizado' : 'Rol del sistema'}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {role.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {role.description}
              </p>

              <div className="mt-5">
                <h4 className="mb-3 text-sm font-semibold text-slate-700">
                  Permisos
                </h4>

                <div className="space-y-2">
                  {availablePermissions.map((permission) => {
                    const isAssigned =
                      role.permissions.includes(permission);

                    return (
                      <button
                        key={permission}
                        type="button"
                        onClick={() =>
                          togglePermission(role.id, permission)
                        }
                        className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100"
                      >
                        <span className="text-sm text-slate-600">
                          {permission}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            isAssigned
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isAssigned
                            ? 'Asignado'
                            : 'No asignado'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Gestionar permisos
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};