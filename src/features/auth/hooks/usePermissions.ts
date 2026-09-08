import { useAuth } from './useAuth';
import { useRolesContext } from '../../roles/context/RolesContext';
import { ModuleName } from '../../roles/types/role';

export function usePermissions() {
  const { user } = useAuth();
  const { hasPermission } = useRolesContext();

  const roleName = user?.role || 'Usuario';
  const isRoleAdmin = roleName.toLowerCase() === 'administrador';

  const check = (module: ModuleName, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'): boolean => {
    // Si el usuario no tiene rol asignado o es Administrador, tiene acceso completo por defecto
    if (!user) return false;
    return hasPermission(roleName, module, action);
  };

  return {
    roleName,
    isRoleAdmin,
    canCreate: (module: ModuleName) => check(module, 'canCreate'),
    canRead: (module: ModuleName) => check(module, 'canRead'),
    canUpdate: (module: ModuleName) => check(module, 'canUpdate'),
    canDelete: (module: ModuleName) => check(module, 'canDelete')
  };
}
