import React from 'react';

export const AdminSpecialtiesPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">
          Gestión de Especialidades Médicas
        </h1>

        <p className="text-sm text-slate-500">
          Administración del catálogo de especialidades
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <h2 className="font-bold">
          Especialidades
        </h2>
      </div>
    </div>
  );
};
