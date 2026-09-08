import React from 'react';
import { Role, ModuleName } from '../types/role';
import { ToggleSwitch } from '../../../components/ui/ToggleSwitch';

interface PermissionMatrixProps {
  role: Role;
  onToggle: (roleId: string, module: ModuleName, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete') => void;
  isReadOnly?: boolean;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ role, onToggle, isReadOnly = false }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 px-6 bg-surface-low border-b border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-bold text-dark-slate text-base">Matriz de Permisos por Módulo</h4>
            {isReadOnly && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded border border-amber-200">
                Solo Lectura
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {isReadOnly
              ? `Vista de permisos configurados para el rol "${role.name}" (No tienes permiso de edición)`
              : `Configuración de acciones permitidas para el rol "${role.name}"`}
          </p>
        </div>

        <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full border border-emerald-200">
          {role.permissions.filter((p) => p.canRead).length} Módulos Habilitados
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-6">Módulo / Sección</th>
              <th className="p-4 text-center">Crear</th>
              <th className="p-4 text-center">Leer / Ver</th>
              <th className="p-4 text-center">Editar</th>
              <th className="p-4 text-center pr-6">Eliminar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {role.permissions.map((perm) => (
              <tr key={perm.module} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 pl-6">
                  <div className="font-semibold text-dark-slate">{perm.moduleLabel}</div>
                  <div className="text-[11px] text-slate-400 font-mono">module.{perm.module}</div>
                </td>

                <td className="p-4 text-center">
                  <ToggleSwitch
                    checked={perm.canCreate}
                    onChange={() => !isReadOnly && onToggle(role.id, perm.module, 'canCreate')}
                    disabled={isReadOnly}
                  />
                </td>

                <td className="p-4 text-center">
                  <ToggleSwitch
                    checked={perm.canRead}
                    onChange={() => !isReadOnly && onToggle(role.id, perm.module, 'canRead')}
                    disabled={isReadOnly}
                  />
                </td>

                <td className="p-4 text-center">
                  <ToggleSwitch
                    checked={perm.canUpdate}
                    onChange={() => !isReadOnly && onToggle(role.id, perm.module, 'canUpdate')}
                    disabled={isReadOnly}
                  />
                </td>

                <td className="p-4 text-center pr-6">
                  <ToggleSwitch
                    checked={perm.canDelete}
                    onChange={() => !isReadOnly && onToggle(role.id, perm.module, 'canDelete')}
                    disabled={isReadOnly}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
