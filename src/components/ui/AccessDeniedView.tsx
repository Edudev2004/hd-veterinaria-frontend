import React from 'react';
import { Button } from './Button';

interface AccessDeniedViewProps {
  moduleName: string;
  userRole: string;
  onNavigateBack?: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  moduleName,
  userRole,
  onNavigateBack
}) => {
  return (
    <div className="p-6 max-w-4xl mx-auto my-12 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-red-100/80 text-red-600 flex items-center justify-center mb-5 shadow-sm">
        <span className="material-symbols-outlined text-[42px]">lock_reset</span>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-3">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Acceso Restringido por Matriz de Permisos
      </div>

      <h2 className="font-heading font-bold text-2xl text-dark-slate mb-2">
        Sin Permisos para "{moduleName}"
      </h2>

      <p className="text-slate-600 text-sm max-w-md mb-6 leading-relaxed">
        Tu rol actual (<strong className="text-dark-slate">{userRole}</strong>) no tiene habilitado el permiso de lectura para la sección de <strong className="text-dark-slate">{moduleName}</strong>.
      </p>

      <div className="bg-surface-low border border-slate-200 p-4 rounded-xl max-w-lg text-xs text-slate-500 mb-6 text-left w-full flex items-start gap-3">
        <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">info</span>
        <div>
          <strong className="text-dark-slate font-semibold block mb-0.5">¿Necesitas acceso a esta sección?</strong>
          Contacta al Administrador de la clínica para que modifique la matriz de permisos de tu rol en el módulo de Roles y Permisos.
        </div>
      </div>

      {onNavigateBack && (
        <Button variant="secondary" icon="arrow_back" onClick={onNavigateBack}>
          Volver a un Módulo Permitido
        </Button>
      )}
    </div>
  );
};
