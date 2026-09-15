import React from 'react';

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

      <div className="rounded-2xl bg-white p-6">
        <h2 className="mb-4 font-bold text-slate-800">
          Roles del sistema
        </h2>

        <p className="text-sm text-slate-500">
          Aquí se mostrarán los roles y permisos disponibles.
        </p>
      </div>
    </div>
  );
};