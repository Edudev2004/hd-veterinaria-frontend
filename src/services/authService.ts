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

export interface LoginPayload {
  email: string;
  password: string;
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

// Cuentas iniciales de prueba para evaluar los 3 roles del sistema
const DEFAULT_SEED_USERS: DBUsuario[] = [
  {
    id: 'usr-seed-prop-01',
    nombre: 'Carlos Propietario',
    email: 'propietario@vethd.com',
    password_hash: '12345678',
    rol: 'propietario',
    activo: true,
    created_at: new Date('2026-01-01').toISOString()
  },
  {
    id: 'usr-seed-vet-01',
    nombre: 'Dra. Laura Veterinario',
    email: 'veterinario@vethd.com',
    password_hash: '12345678',
    rol: 'veterinario',
    activo: true,
    created_at: new Date('2026-01-01').toISOString()
  },
  {
    id: 'usr-seed-admin-01',
    nombre: 'Administrador VetHD',
    email: 'admin@vethd.com',
    password_hash: '12345678',
    rol: 'admin',
    activo: true,
    created_at: new Date('2026-01-01').toISOString()
  }
];

const DEFAULT_SEED_PROPIETARIOS: DBPropietario[] = [
  {
    id: 'prop-seed-01',
    usuario_id: 'usr-seed-prop-01',
    telefono: '987654321',
    direccion: 'Av. Las Palmeras 450, Lima'
  }
];

const getStoredUsers = (): DBUsuario[] => {
  const data = localStorage.getItem(STORAGE_USERS_KEY);
  if (!data) {
    // Inicializar con semillas por defecto si no existen
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_SEED_USERS));
    return DEFAULT_SEED_USERS;
  }
  try {
    const parsed: DBUsuario[] = JSON.parse(data);
    // Asegurar que las cuentas por defecto existan siempre para pruebas
    let modified = false;
    DEFAULT_SEED_USERS.forEach((seed) => {
      if (!parsed.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
        parsed.push(seed);
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_SEED_USERS;
  }
};

const getStoredPropietarios = (): DBPropietario[] => {
  const data = localStorage.getItem(STORAGE_PROPIETARIOS_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_PROPIETARIOS_KEY, JSON.stringify(DEFAULT_SEED_PROPIETARIOS));
    return DEFAULT_SEED_PROPIETARIOS;
  }
  try {
    const parsed: DBPropietario[] = JSON.parse(data);
    DEFAULT_SEED_PROPIETARIOS.forEach((seed) => {
      if (!parsed.some((p) => p.usuario_id === seed.usuario_id)) {
        parsed.push(seed);
      }
    });
    return parsed;
  } catch {
    return DEFAULT_SEED_PROPIETARIOS;
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

// US-02: Inicio de sesión validando credenciales contra localStorage
export const loginUser = async (payload: LoginPayload): Promise<User> => {
  // Simular breve latencia de red realista
  await new Promise((resolve) => setTimeout(resolve, 350));

  const users = getStoredUsers();
  const propietarios = getStoredPropietarios();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.password_hash !== payload.password) {
    throw new Error('Correo electrónico o contraseña incorrectos. Verifica tus credenciales.');
  }

  if (!user.activo) {
    throw new Error('Esta cuenta ha sido desactivada. Por favor, comunícate con la administración.');
  }

  const prop = propietarios.find((p) => p.usuario_id === user.id);

  const sessionUser: User = {
    id: user.id,
    propietarioId: prop?.id,
    nombre: user.nombre,
    email: user.email,
    telefono: prop?.telefono,
    direccion: prop?.direccion,
    rol: user.rol,
    activo: user.activo,
    createdAt: user.created_at
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
  login: loginUser,
  getCurrentUser,
  logout: logoutUser
};
