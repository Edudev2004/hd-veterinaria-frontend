import { useState, useMemo } from 'react';
import { UserProfile, CreateUserDTO, UpdateUserDTO } from '../types/user';

const initialUsers: UserProfile[] = [
  {
    id: 'user-admin-1',
    name: 'Dr. Fernando Delgado',
    email: 'admin@veterinariahd.com',
    roleId: 'role-admin',
    roleName: 'Administrador',
    isActive: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL-QGH-WFTpd7iyuG5QNKGiwl_FsZOVTkWVutex4LxUjdxWcfMgCH1WJCBH9XwXKh7mqVw9etKolHgkeuGbZyQ5j2wZ9bSGT_DJvYPfUM8imx3DRlowiru0Ee6fYfXiAKJxkydbF5Pmmvv9jdu97CTlr6vfS-owOkQjh17M2HO5YFrhpzohrGF-AXqiaxosi-zCJ0RfDIT3tPFwHxV1rTrWk2IK-Gy5e4Aa0IRrgxKNWFKGRPbhPRF',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-vet-1',
    name: 'Dra. Sofía Montes',
    email: 'vet.montes@veterinariahd.com',
    roleId: 'role-vet',
    roleName: 'Veterinario',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-recep-1',
    name: 'Carlos Ramírez',
    email: 'carlos.recepcion@veterinariahd.com',
    roleId: 'role-recep',
    roleName: 'Recepcionista',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-vet-2',
    name: 'Dr. Mateo Benítez',
    email: 'mateo.vet@veterinariahd.com',
    roleId: 'role-vet',
    roleName: 'Veterinario',
    isActive: false, // Desactivado de prueba
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [error, setError] = useState<string | null>(null);

  // Filtrado reactivo por texto y por rol
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.roleId === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const createUser = (dto: CreateUserDTO, roleName: string): boolean => {
    if (!dto.name || !dto.name.trim()) {
      setError('El nombre del usuario es requerido.');
      return false;
    }

    if (!dto.email || !dto.email.trim()) {
      setError('El correo electrónico es requerido.');
      return false;
    }

    const normalizedEmail = dto.email.toLowerCase().trim();

    // Validar correo único
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      setError(`Ya existe un usuario registrado con el correo "${dto.email}".`);
      return false;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: dto.name.trim(),
      email: normalizedEmail,
      roleId: dto.roleId,
      roleName: roleName,
      isActive: true,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dto.name)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setUsers((prev) => [newUser, ...prev]);
    setError(null);
    return true;
  };

  const updateUser = (id: string, dto: UpdateUserDTO, roleName?: string): boolean => {
    const user = users.find((u) => u.id === id);
    if (!user) return false;

    if (dto.email && dto.email.trim()) {
      const normalizedEmail = dto.email.toLowerCase().trim();
      const existing = users.find((u) => u.id !== id && u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        setError(`Ya existe otro usuario con el correo "${dto.email}".`);
        return false;
      }
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        return {
          ...u,
          name: dto.name ? dto.name.trim() : u.name,
          email: dto.email ? dto.email.toLowerCase().trim() : u.email,
          roleId: dto.roleId || u.roleId,
          roleName: roleName || u.roleName,
          isActive: dto.isActive !== undefined ? dto.isActive : u.isActive,
          updatedAt: new Date().toISOString()
        };
      })
    );

    setError(null);
    return true;
  };

  /**
   * Desactiva / Reactiva un usuario del sistema.
   * Criterio de Aceptación: Desactivación LÓGICA (isActive: false) manteniendo el registro en la BD.
   */
  const toggleUserStatus = (id: string): void => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        return {
          ...u,
          isActive: !u.isActive,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    createUser,
    updateUser,
    toggleUserStatus,
    error,
    setError
  };
}
