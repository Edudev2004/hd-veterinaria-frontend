import React, { createContext, useContext, useState } from 'react';
import { Role, ModulePermission, CreateRoleDTO, ModuleName } from '../types/role';
import { useUsersContext } from '../../users/context/UsersContext';

const STORAGE_KEY = 'vethd_roles_data_v3';

const defaultModules: { module: ModuleName; label: string }[] = [
  { module: 'usuarios', label: 'Gestión de Usuarios' },
  { module: 'roles', label: 'Gestión de Roles y Permisos' },
  { module: 'clientes', label: 'Clientes (Dueños)' },
  { module: 'mascotas', label: 'Mascotas (Pacientes)' },
  { module: 'citas', label: 'Citas y Calendario' },
  { module: 'historial_medico', label: 'Historial Médico y Consultas' },
  { module: 'inventario', label: 'Inventario de Medicamentos' },
  { module: 'facturacion', label: 'Facturación y Ventas' }
];

export function createDefaultPermissions(allTrue = false): ModulePermission[] {
  return defaultModules.map((m) => ({
    module: m.module,
    moduleLabel: m.label,
    canCreate: allTrue,
    canRead: true,
    canUpdate: allTrue,
    canDelete: allTrue
  }));
}

const initialRolesBase: Omit<Role, 'assignedUsersCount'>[] = [
  {
    id: 'role-admin',
    name: 'Administrador',
    description: 'Acceso total y control absoluto de la clínica veterinaria.',
    permissions: createDefaultPermissions(true),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'role-vet',
    name: 'Veterinario',
    description: 'Atención médica de pacientes, recetas e historial clínico.',
    permissions: defaultModules.map((m) => ({
      module: m.module,
      moduleLabel: m.label,
      canCreate: m.module !== 'roles' && m.module !== 'usuarios',
      canRead: true,
      canUpdate: m.module !== 'roles',
      canDelete: m.module === 'historial_medico'
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'role-recep',
    name: 'Recepcionista',
    description: 'Registro de clientes, agendamiento de citas y cobros.',
    permissions: defaultModules.map((m) => ({
      module: m.module,
      moduleLabel: m.label,
      canCreate: m.module === 'clientes' || m.module === 'mascotas' || m.module === 'citas' || m.module === 'facturacion',
      canRead: m.module !== 'roles',
      canUpdate: m.module === 'citas',
      canDelete: false
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface RolesContextType {
  roles: Role[];
  selectedRole: Role;
  selectedRoleId: string;
  setSelectedRoleId: (id: string) => void;
  togglePermission: (roleId: string, module: ModuleName, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete') => void;
  createRole: (dto: CreateRoleDTO) => boolean;
  deleteRole: (roleId: string) => boolean;
  hasPermission: (roleIdOrName: string, module: ModuleName, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete') => boolean;
  error: string | null;
  setError: (err: string | null) => void;
}

const RolesContext = createContext<RolesContextType | undefined>(undefined);

export const RolesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getAssignedUsersCount } = useUsersContext();

  const [rawRoles, setRawRoles] = useState<Omit<Role, 'assignedUsersCount'>[]>(() => {
    localStorage.removeItem('vethd_roles_data');
    localStorage.removeItem('vethd_roles_data_v2');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Always force role-admin to have all permissions true
          return parsed.map((r) => {
            if (r.id === 'role-admin' || r.name.toLowerCase() === 'administrador') {
              return { ...r, permissions: createDefaultPermissions(true) };
            }
            return r;
          });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return initialRolesBase;
  });

  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-admin');
  const [error, setError] = useState<string | null>(null);

  const saveRoles = (newRoles: Omit<Role, 'assignedUsersCount'>[]) => {
    setRawRoles(newRoles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRoles));
  };

  // Dynamically compute assignedUsersCount for every role
  const roles: Role[] = rawRoles.map((r) => ({
    ...r,
    assignedUsersCount: getAssignedUsersCount(r.id)
  }));

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const togglePermission = (
    roleId: string,
    module: ModuleName,
    action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'
  ) => {
    // PROTECCIÓN: El rol Administrador no se puede modificar para evitar bloqueos del sistema
    const target = rawRoles.find((r) => r.id === roleId);
    if (target && (target.id === 'role-admin' || target.name.toLowerCase() === 'administrador')) {
      setError('Los permisos del rol Administrador están protegidos y no pueden ser desactivados.');
      return;
    }

    const updated = rawRoles.map((role) => {
      if (role.id !== roleId) return role;
      const updatedPermissions = role.permissions.map((p) => {
        if (p.module !== module) return p;
        return { ...p, [action]: !p[action] };
      });
      return { ...role, permissions: updatedPermissions, updatedAt: new Date().toISOString() };
    });
    saveRoles(updated);
    setError(null);
  };

  const createRole = (dto: CreateRoleDTO): boolean => {
    if (!dto.name || !dto.name.trim()) {
      setError('El nombre del rol es requerido.');
      return false;
    }

    const existing = rawRoles.find((r) => r.name.toLowerCase() === dto.name.toLowerCase().trim());
    if (existing) {
      setError(`Ya existe un rol con el nombre "${dto.name}".`);
      return false;
    }

    const newRole: Omit<Role, 'assignedUsersCount'> = {
      id: `role-${Date.now()}`,
      name: dto.name.trim(),
      description: dto.description || '',
      permissions: dto.permissions || createDefaultPermissions(false),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [...rawRoles, newRole];
    saveRoles(updated);
    setSelectedRoleId(newRole.id);
    setError(null);
    return true;
  };

  const deleteRole = (roleId: string): boolean => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return false;

    // PROTECCIÓN: El rol Administrador del sistema está protegido contra eliminación
    if (role.id === 'role-admin' || role.name.toLowerCase() === 'administrador') {
      setError('El rol Administrador es un rol base del sistema y no se puede eliminar.');
      return false;
    }

    if (role.assignedUsersCount > 0) {
      setError(`No se puede eliminar el rol "${role.name}" porque tiene ${role.assignedUsersCount} usuario(s) asignado(s).`);
      return false;
    }

    const updated = rawRoles.filter((r) => r.id !== roleId);
    saveRoles(updated);

    if (selectedRoleId === roleId) {
      if (updated.length > 0) setSelectedRoleId(updated[0].id);
    }
    setError(null);
    return true;
  };

  const hasPermission = (
    roleIdOrName: string,
    module: ModuleName,
    action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'
  ): boolean => {
    const targetRole = roles.find(
      (r) => r.id === roleIdOrName || r.name.toLowerCase() === roleIdOrName.toLowerCase()
    );
    if (!targetRole) return false;

    // El rol Administrador siempre tiene permiso total
    if (targetRole.id === 'role-admin' || targetRole.name.toLowerCase() === 'administrador') {
      return true;
    }

    const perm = targetRole.permissions.find((p) => p.module === module);
    return perm ? perm[action] : false;
  };

  return (
    <RolesContext.Provider
      value={{
        roles,
        selectedRole,
        selectedRoleId,
        setSelectedRoleId,
        togglePermission,
        createRole,
        deleteRole,
        hasPermission,
        error,
        setError
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};

export const useRolesContext = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRolesContext debe ser usado dentro de un RolesProvider');
  }
  return context;
};
