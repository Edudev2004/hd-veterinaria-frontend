import { apiRequest } from "@/services/apiClient";
import {
  clearSession,
  getStoredUser,
  getToken,
  saveSession,
} from "@/services/tokenStorage";

export type UserRole = "propietario" | "veterinario" | "admin";

export interface User {
  id: string; // usuario_id (UUID)
  propietarioId?: string; // id de tabla propietarios (UUID)
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fotoUrl?: string;
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

interface AuthApiResponse {
  token: string;
  id: string;
  propietarioId: string | null;
  nombre: string;
  firstName?: string;
  lastName?: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  rol: string;
  activo: boolean;
  createdAt: string;
  user?: {
    fotoUrl?: string | null;
  };
}

const toUser = (response: AuthApiResponse): User => ({
  id: response.id,
  propietarioId: response.propietarioId ?? undefined,
  nombre: response.nombre,
  email: response.email,
  telefono: response.telefono ?? undefined,
  direccion: response.direccion ?? undefined,
  fotoUrl: response.user?.fotoUrl ?? undefined,
  rol: response.rol as UserRole,
  activo: response.activo,
  createdAt: response.createdAt,
});

const STORAGE_USERS_KEY = "vethd_db_usuarios";

interface DBUsuario {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  rol: UserRole;
  activo: boolean;
  created_at: string;
}

// Cuentas iniciales de prueba para evaluar los 3 roles del sistema
const DEFAULT_SEED_USERS: DBUsuario[] = [
  {
    id: "usr-seed-prop-01",
    nombre: "Carlos Propietario",
    email: "propietario@vethd.com",
    password_hash: "12345678",
    rol: "propietario",
    activo: true,
    created_at: new Date("2026-01-01").toISOString(),
  },
  {
    id: "usr-seed-vet-01",
    nombre: "Dra. Laura Veterinario",
    email: "veterinario@vethd.com",
    password_hash: "12345678",
    rol: "veterinario",
    activo: true,
    created_at: new Date("2026-01-01").toISOString(),
  },
  {
    id: "usr-seed-admin-01",
    nombre: "Administrador VetHD",
    email: "admin@vethd.com",
    password_hash: "12345678",
    rol: "admin",
    activo: true,
    created_at: new Date("2026-01-01").toISOString(),
  },
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
      if (
        !parsed.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())
      ) {
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

export const registerOwner = async (
  payload: RegisterPayload,
): Promise<User> => {
  const response = await apiRequest<AuthApiResponse>("/api/auth/register", {
    method: "POST",
    auth: false,
    body: {
      nombre: payload.nombre.trim(),
      email: payload.email.trim(),
      password: payload.password,
      telefono: payload.telefono.trim(),
      direccion: payload.direccion?.trim() || undefined,
    },
  });

  const user = toUser(response);
  saveSession(response.token, user, true);
  return user;
};

// US-02: Inicio de sesión contra el backend
export const loginUser = async (
  payload: LoginPayload,
  remember = true,
): Promise<User> => {
  const response = await apiRequest<AuthApiResponse>("/api/auth/login", {
    method: "POST",
    auth: false,
    body: {
      email: payload.email.trim(),
      password: payload.password,
    },
  });

  const user = toUser(response);
  saveSession(response.token, user, remember);
  return user;
};

export const getCurrentUser = (): User | null => getStoredUser();

export const logoutUser = (): void => {
  const token = getToken();
  clearSession();

  if (!token) {
    return;
  }

  // El logout local ya se completó; un fallo del backend no debe bloquear al usuario.
  void apiRequest<void>("/api/auth/logout", {
    method: "POST",
    auth: false,
    token,
  }).catch(() => undefined);
};

// US-05: Solicitar recuperación de contraseña (simula envío de correo y genera token)
export const requestPasswordReset = async (
  email: string,
): Promise<{ email: string; token: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    throw new Error(
      "No se encontró ninguna cuenta registrada con este correo electrónico.",
    );
  }

  const token = crypto.randomUUID ? crypto.randomUUID() : `reset-${Date.now()}`;
  return { email: normalizedEmail, token };
};

// US-05: Actualizar la contraseña en localStorage
export const resetPassword = async (
  email: string,
  newPassword: string,
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (newPassword.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const userIndex = users.findIndex(
    (u) => u.email.toLowerCase() === normalizedEmail,
  );

  if (userIndex === -1) {
    throw new Error("No se encontró la cuenta para actualizar la contraseña.");
  }

  users[userIndex].password_hash = newPassword;
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

  return true;
};
export const authService = {
  register: registerOwner,
  login: loginUser,
  getCurrentUser,
  logout: logoutUser,
  requestPasswordReset,
  resetPassword,
};
