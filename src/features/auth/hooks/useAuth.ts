import { useState } from 'react';
import { insforge } from '../../../config/insforge';
import { AuthState, UserSession } from '../types/auth';

const MAX_FAILED_ATTEMPTS = 5;
const failedAttemptsMap = new Map<string, number>();

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    failedAttempts: 0,
    isLocked: false
  });

  const getFailedAttempts = (email: string): number => {
    const key = email.toLowerCase().trim();
    return failedAttemptsMap.get(key) || 0;
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const normalizedEmail = email.toLowerCase().trim();

    if (!email || !email.trim()) {
      setState(prev => ({ ...prev, error: 'El correo electrónico es requerido.' }));
      return false;
    }

    if (!pass) {
      setState(prev => ({ ...prev, error: 'La contraseña es requerida.' }));
      return false;
    }

    const currentAttempts = getFailedAttempts(normalizedEmail);
    if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
      setState(prev => ({
        ...prev,
        error: 'Cuenta bloqueada por 5 intentos fallidos. Contacte al administrador.',
        isLocked: true,
        failedAttempts: currentAttempts
      }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email: normalizedEmail,
        password: pass
      });

      if (error || !data) {
        const newAttempts = currentAttempts + 1;
        failedAttemptsMap.set(normalizedEmail, newAttempts);
        const isLockedNow = newAttempts >= MAX_FAILED_ATTEMPTS;

        const errorMsg = isLockedNow
          ? 'Cuenta bloqueada por 5 intentos fallidos. Contacte al administrador.'
          : `Credenciales incorrectas. (Quedan ${MAX_FAILED_ATTEMPTS - newAttempts} intentos)`;

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMsg,
          failedAttempts: newAttempts,
          isLocked: isLockedNow
        }));
        return false;
      }

      // Login exitoso
      failedAttemptsMap.delete(normalizedEmail);
      const userSession: UserSession = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.email.split('@')[0],
        token: data.accessToken
      };

      setState({
        isAuthenticated: true,
        user: userSession,
        loading: false,
        error: null,
        failedAttempts: 0,
        isLocked: false
      });

      return true;
    } catch {
      // Manejo de error de red o fallback de prueba
      const newAttempts = currentAttempts + 1;
      failedAttemptsMap.set(normalizedEmail, newAttempts);
      const isLockedNow = newAttempts >= MAX_FAILED_ATTEMPTS;

      const errorMsg = isLockedNow
        ? 'Cuenta bloqueada por 5 intentos fallidos. Contacte al administrador.'
        : `Credenciales incorrectas. (Quedan ${MAX_FAILED_ATTEMPTS - newAttempts} intentos)`;

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMsg,
        failedAttempts: newAttempts,
        isLocked: isLockedNow
      }));
      return false;
    }
  };

  const logout = () => {
    insforge.auth.signOut();
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      failedAttempts: 0,
      isLocked: false
    });
  };

  return {
    ...state,
    login,
    logout
  };
}
