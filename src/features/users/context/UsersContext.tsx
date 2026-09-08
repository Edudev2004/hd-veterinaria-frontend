import React, { createContext, useContext, useState, useEffect } from 'react';
import { insforge } from '../../../config/insforge';
import { UserProfile, CreateUserDTO, UpdateUserDTO } from '../types/user';

const STORAGE_KEY = 'vethd_users_data_v2';

// 3 Exact Users from InsForge Database
const initialUsers: UserProfile[] = [
  {
    id: '32c69d6d-9b3b-4c6a-8f9f-5b1ed98e9ffa',
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
    id: 'e291eb08-7720-4286-8a36-3e6d03020d37',
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
    id: '9f08f6ee-0438-4269-96c6-258889aa163d',
    name: 'Carlos Ramírez',
    email: 'carlos.recepcion@veterinariahd.com',
    roleId: 'role-recep',
    roleName: 'Recepcionista',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface UsersContextType {
  users: UserProfile[];
  createUser: (dto: CreateUserDTO, roleName: string) => boolean;
  updateUser: (id: string, dto: UpdateUserDTO, roleName?: string) => boolean;
  toggleUserStatus: (id: string) => void;
  getAssignedUsersCount: (roleId: string) => number;
  error: string | null;
  setError: (err: string | null) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    // Clear old v1 storage key if present
    localStorage.removeItem('vethd_users_data');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return initialUsers;
  });

  const [error, setError] = useState<string | null>(null);

  // Sync with InsForge Database on mount
  useEffect(() => {
    async function fetchDatabaseUsers() {
      try {
        const { data, error } = await insforge.database
          .from('user_profiles')
          .select('*');

        if (!error && data && data.length > 0) {
          const roleMap: Record<string, string> = {
            'role-admin': 'Administrador',
            'role-vet': 'Veterinario',
            'role-recep': 'Recepcionista'
          };

          const avatarMap: Record<string, string> = {
            'admin@veterinariahd.com': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL-QGH-WFTpd7iyuG5QNKGiwl_FsZOVTkWVutex4LxUjdxWcfMgCH1WJCBH9XwXKh7mqVw9etKolHgkeuGbZyQ5j2wZ9bSGT_DJvYPfUM8imx3DRlowiru0Ee6fYfXiAKJxkydbF5Pmmvv9jdu97CTlr6vfS-owOkQjh17M2HO5YFrhpzohrGF-AXqiaxosi-zCJ0RfDIT3tPFwHxV1rTrWk2IK-Gy5e4Aa0IRrgxKNWFKGRPbhPRF',
            'vet.montes@veterinariahd.com': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
            'carlos.recepcion@veterinariahd.com': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
          };

          const dbUsers: UserProfile[] = data.map((item: any) => ({
            id: item.id,
            name: item.name || item.full_name || 'Usuario',
            email: item.email,
            roleId: item.role_id,
            roleName: roleMap[item.role_id] || item.role_id,
            isActive: item.is_active !== undefined ? item.is_active : true,
            avatarUrl: avatarMap[item.email] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.name || item.email)}`,
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString()
          }));

          setUsers(dbUsers);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbUsers));
        }
      } catch {
        // Fallback to local state if offline
      }
    }

    fetchDatabaseUsers();
  }, []);

  const saveUsers = (newUsers: UserProfile[]) => {
    setUsers(newUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
  };

  const getAssignedUsersCount = (roleId: string): number => {
    return users.filter((u) => u.roleId === roleId).length;
  };

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

    saveUsers([newUser, ...users]);
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

    const updated = users.map((u) => {
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
    });

    saveUsers(updated);
    setError(null);
    return true;
  };

  const toggleUserStatus = (id: string): void => {
    const updated = users.map((u) => {
      if (u.id !== id) return u;
      return {
        ...u,
        isActive: !u.isActive,
        updatedAt: new Date().toISOString()
      };
    });
    saveUsers(updated);
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        createUser,
        updateUser,
        toggleUserStatus,
        getAssignedUsersCount,
        error,
        setError
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsersContext debe ser usado dentro de un UsersProvider');
  }
  return context;
};
