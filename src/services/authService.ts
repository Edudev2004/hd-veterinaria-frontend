export type UserRole = 'PROPIETARIO' | 'VETERINARIO' | 'ADMINISTRADOR';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  rol: UserRole;
  activo: boolean;
  createdAt: string;
}

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
  direccion?: string;
}

const getInitialUsers = (): DBUsuario[] => {
  const data = localStorage.getItem(STORAGE_USERS_KEY);
  return data ? JSON.parse(data) : [];
};

const getInitialPropietarios = (): DBPropietario[] => {
  const data = localStorage.getItem(STORAGE_PROPIETARIOS_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerOwner = async (payload: RegisterPayload): Promise<Usuario> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const users = getInitialUsers();
  const propietarios = getInitialPropietarios();

  const normalizedEmail = payload.email.toLowerCase().trim();
  const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (existingUser) {
    throw new Error('El correo electrónico ya se encuentra registrado.');
  }

  const userId = crypto.randomUUID();
  const propietarioId = crypto.randomUUID();
  const now = new Date().toISOString();

  const newUser: DBUsuario = {
    id: userId,
    nombre: payload.nombre,
    email: normalizedEmail,
    password_hash: payload.password,
    rol: 'PROPIETARIO',
    activo: true,
    created_at: now,
  };

  const newPropietario: DBPropietario = {
    id: propietarioId,
    usuario_id: userId,
    telefono: payload.telefono,
    direccion: payload.direccion,
  };

  users.push(newUser);
  propietarios.push(newPropietario);

  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(STORAGE_PROPIETARIOS_KEY, JSON.stringify(propietarios));

  const sessionUser: Usuario = {
    id: userId,
    nombre: newUser.nombre,
    email: newUser.email,
    telefono: newPropietario.telefono,
    direccion: newPropietario.direccion,
    rol: newUser.rol,
    activo: newUser.activo,
    createdAt: newUser.created_at,
  };

  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(sessionUser));

  return sessionUser;
};

export const getCurrentUser = (): Usuario | null => {
  const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
};
