import React from 'react';
import { User } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Mi Perfil</h1>
          <p className="text-sm text-slate-500">Información personal y configuración de cuenta</p>
        </div>
      </div>

      <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Espacio de Trabajo: Módulo de Perfil</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Los desarrolladores asignados a la US-06 y US-07 pueden implementar sus componentes dentro de <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-600">src/pages/ProfilePage.tsx</code>.
        </p>
      </div>
    </div>
  );
};
