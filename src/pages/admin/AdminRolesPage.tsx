import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AdminRolesPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">Gestión de Roles y Matriz de Permisos</h1>
        <p className="text-sm text-slate-500">Mapeado desde Jira US-30</p>
      </div>

      <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Espacio de Trabajo: Matriz RBAC de Permisos</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Los desarrolladores asignados a la US-30 pueden implementar sus componentes dentro de <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-600">src/pages/admin/AdminRolesPage.tsx</code>.
        </p>
      </div>
    </div>
  );
};
