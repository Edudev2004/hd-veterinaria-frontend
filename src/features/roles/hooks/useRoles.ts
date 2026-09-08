import { useState } from 'react';
import { Role, ModulePermission, CreateRoleDTO, ModuleName } from '../types/role';

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

const initialRoles: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrador',
    description: 'Acceso total y control absoluto de la clínica veterinaria.',
    assignedUsersCount: 2,
    permissions: createDefaultPermissions(true),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'role-vet',
    name: 'Veterinario',
    description: 'Atención médica de pacientes, recetas e historial clínico.',
    assignedUsersCount: 1,
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
    assignedUsersCount: 0,
    permissions: defaultModules.map((m) => ({
      module: m.module,
      moduleLabel: m.label,
      canCreate: m.module === 'clientes' || m.module === 'mascotas' || m.module === 'citas' || m.module === 'facturacion',
      canRead: true,
      canUpdate: m.module === 'citas',
      canDelete: false
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoles[0].id);
  const [error, setError] = useState<string | null>(null);

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const togglePermission = (roleId: string, module: ModuleName, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete') => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role;
        const updatedPermissions = role.permissions.map((p) => {
          if (p.module !== module) return p;
          return { ...p, [action]: !p[action] };
        });
        return { ...role, permissions: updatedPermissions, updatedAt: new Date().toISOString() };
      })
    );
  };

  const createRole = (dto: CreateRoleDTO): boolean => {
    if (!dto.name || !dto.name.trim()) {
      setError('El nombre del rol es requerido.');
      return false;
    }

    const existing = roles.find((r) => r.name.toLowerCase() === dto.name.toLowerCase().trim());
    if (existing) {
      setError(`Ya existe un rol con el nombre "${dto.name}".`);
      return false;
    }

    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: dto.name.trim(),
      description: dto.description || '',
      assignedUsersCount: 0,
      permissions: dto.permissions || createDefaultPermissions(false),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRoles((prev) => [...prev, newRole]);
    setSelectedRoleId(newRole.id);
    setError(null);
    return true;
  };

  const deleteRole = (roleId: string): boolean => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return false;

    // Criterio de Aceptación: No se puede eliminar si tiene usuarios asignados
    if (role.assignedUsersCount > 0) {
      setError(`No se puede eliminar el rol "${role.name}" porque tiene ${role.assignedUsersCount} usuario(s) asignado(s).`);
      return false;
    }

    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    if (selectedRoleId === roleId) {
      const remaining = roles.filter((r) => r.id !== roleId);
      if (remaining.length > 0) setSelectedRoleId(remaining[0].id);
    }
    setError(null);
    return true;
  };

  return {
    roles,
    selectedRole,
    selectedRoleId,
    setSelectedRoleId,
    togglePermission,
    createRole,
    deleteRole,
    error,
    setError
  };
}
