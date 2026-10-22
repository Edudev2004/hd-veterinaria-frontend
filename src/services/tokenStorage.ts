import type { User } from '@/services/authService';

const TOKEN_KEY = 'vethd_token';
const USER_KEY = 'vethd_session_usuario';

export interface StoredSession {
  token: string;
  user: User;
}

const getStorages = (): Storage[] => [
  window.localStorage,
  window.sessionStorage,
];

/**
 * Devuelve la sesión completa (token + usuario) del mismo storage.
 * Se prioriza localStorage sobre sessionStorage.
 */
export const getStoredSession = (): StoredSession | null => {
  for (const storage of getStorages()) {
    const token = storage.getItem(TOKEN_KEY);
    const rawUser = storage.getItem(USER_KEY);

    if (!token || !rawUser) {
      continue;
    }

    try {
      return { token, user: JSON.parse(rawUser) as User };
    } catch {
      storage.removeItem(USER_KEY);
    }
  }

  return null;
};

export const getToken = (): string | null => getStoredSession()?.token ?? null;

export const getStoredUser = (): User | null =>
  getStoredSession()?.user ?? null;

/**
 * Guarda token y usuario en el storage elegido.
 * Limpia ambos storages antes de escribir para evitar sesiones duplicadas.
 */
export const saveSession = (
  token: string,
  user: User,
  remember = true,
): void => {
  clearSession();

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Actualiza el usuario dentro del storage que ya contiene la sesión.
 * Se usa como puente mientras no existe endpoint de perfil en el backend.
 */
export const updateStoredUser = (user: User): void => {
  const storage = getStorages().find((item) => item.getItem(TOKEN_KEY));

  if (storage) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearSession = (): void => {
  for (const storage of getStorages()) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
  }
};
