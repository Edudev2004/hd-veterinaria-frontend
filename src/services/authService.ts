export type UserRole = 'propietario' | 'veterinario' | 'admin';

export interface User {
  id: string; // usuario_id (UUID)
  propietarioId?: string; // id de tabla propietarios (UUID)
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  rol: UserRole;
  activo: boolean;
  createdAt: string;
}

// Alias para compatibilidad
export type Usuario = User;

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  direccion?: string;
}

const STORAGE_USERS_KEY = 'vethd_db_usuarios';
const STORAGE_PROPIETARIOS_KEY = 'vethd_db_propietarios';
const STORAGE_CURRENT_USER_KEY = 'vethd_session_usuario';

interface DBUsuario {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  rol: UserRole;
  activo: boolean;
  created_at: string;
}

interface DBPropietario {
  id: string;
  usuario_id: string;
  telefono: string;
  direccion: string;
}

const getStoredUsers = (): DBUsuario[] => {
  const data = localStorage.getItem(STORAGE_USERS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const getStoredPropietarios = (): DBPropietario[] => {
  const data = localStorage.getItem(STORAGE_PROPIETARIOS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const registerOwner = async (payload: RegisterPayload): Promise<User> => {
  const users = getStoredUsers();
  const propietarios = getStoredPropietarios();

  const normalizedEmail = payload.email.trim().toLowerCase();

  // Validar duplicado de correo en localStorage (Criterio de Aceptación 5)
  const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    throw new Error('El correo electrónico ya se encuentra registrado en el sistema.');
  }

  const newUserId = crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`;
  const newPropietarioId = crypto.randomUUID ? crypto.randomUUID() : `prop-${Date.now()}`;

  const newDBUser: DBUsuario = {
    id: newUserId,
    nombre: payload.nombre.trim(),
    email: normalizedEmail,
    password_hash: payload.password, // En backend real se usará BCrypt
    rol: 'propietario',
    activo: true,
    created_at: new Date().toISOString()
  };

  const newDBPropietario: DBPropietario = {
    id: newPropietarioId,
    usuario_id: newUserId,
    telefono: payload.telefono.trim(),
    direccion: payload.direccion?.trim() || ''
  };

  users.push(newDBUser);
  propietarios.push(newDBPropietario);

  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(STORAGE_PROPIETARIOS_KEY, JSON.stringify(propietarios));

  const sessionUser: User = {
    id: newDBUser.id,
    propietarioId: newDBPropietario.id,
    nombre: newDBUser.nombre,
    email: newDBUser.email,
    telefono: newDBPropietario.telefono,
    direccion: newDBPropietario.direccion,
    rol: newDBUser.rol,
    activo: newDBUser.activo,
    createdAt: newDBUser.created_at
  };

  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
};

export const authService = {
  register: registerOwner,
  getCurrentUser,
  logout: logoutUser
};
