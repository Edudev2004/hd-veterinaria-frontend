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

// US-05: Solicitar recuperación de contraseña vía API REST
export const requestPasswordReset = async (
  email: string,
): Promise<{ email: string; token: string }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const response = await apiRequest<{ message: string; token?: string }>(
    "/api/auth/recuperar-password",
    {
      method: "POST",
      auth: false,
      body: { email: normalizedEmail },
    },
  );

  return { email: normalizedEmail, token: response?.token || "" };
};

// US-05: Restablecer contraseña vía API REST
export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<boolean> => {
  if (newPassword.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  await apiRequest<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    auth: false,
    body: {
      token: token.trim(),
      newPassword,
    },
  });

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
