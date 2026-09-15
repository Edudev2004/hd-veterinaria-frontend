import React from 'react';
import { Shield, Users, Stethoscope, Settings } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
}

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
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Gestión de Roles y Permisos
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Administración de roles y permisos del sistema
        </p>
      </div>

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
          {initialRoles.map((role) => (
            <div
              key={role.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  {getRoleIcon(role.name)}
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Rol del sistema
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {role.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {role.description}
              </p>

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