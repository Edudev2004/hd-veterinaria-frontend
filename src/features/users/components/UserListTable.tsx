import React from 'react';
import { UserProfile } from '../types/user';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface UserListTableProps {
  users: UserProfile[];
  onEdit: (user: UserProfile) => void;
  onToggleStatus: (userId: string) => void;
}

export const UserListTable: React.FC<UserListTableProps> = ({
  users,
  onEdit,
  onToggleStatus
}) => {
  const getRoleVariant = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'administrador':
        return 'primary';
      case 'veterinario':
        return 'secondary';
      case 'recepcionista':
        return 'warning';
      default:
        return 'slate';
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-slate-300 text-[48px]">group_off</span>
        <h3 className="font-heading font-semibold text-slate-700 text-base">No se encontraron usuarios</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Intenta ajustar los criterios de búsqueda o filtro por rol.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-low text-slate-500 font-semibold text-xs border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-6">Usuario / Nombre</th>
              <th className="p-4">Correo Electrónico</th>
              <th className="p-4">Rol Asignado</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-right pr-6">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Name & Avatar */}
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <div className="font-semibold text-dark-slate flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {!user.isActive && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-normal">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">ID: {user.id}</div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="p-4 font-mono text-xs text-slate-700">{user.email}</td>

                {/* Role */}
                <td className="p-4">
                  <Badge variant={getRoleVariant(user.roleName)}>
                    {user.roleName}
                  </Badge>
                </td>

                {/* Status Pill */}
                <td className="p-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      user.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      icon="edit"
                      onClick={() => onEdit(user)}
                      className="h-8 px-2.5 text-xs"
                      title="Editar usuario"
                    >
                      Editar
                    </Button>

                    <Button
                      variant={user.isActive ? 'outline' : 'primary'}
                      icon={user.isActive ? 'person_off' : 'person_check'}
                      onClick={() => onToggleStatus(user.id)}
                      className={`h-8 px-2.5 text-xs ${
                        user.isActive ? 'text-amber-700 border-amber-200 hover:bg-amber-50' : ''
                      }`}
                      title={user.isActive ? 'Desactivar acceso' : 'Reactivar acceso'}
                    >
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
