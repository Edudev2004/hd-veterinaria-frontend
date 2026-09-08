import React, { createContext, useContext, useState } from 'react';
import { insforge } from '../../../config/insforge';
import { AuthState, UserSession } from '../types/auth';

const MAX_FAILED_ATTEMPTS = 5;
const failedAttemptsMap = new Map<string, number>();
const STORAGE_KEY = 'vethd_auth_session';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Profile mapping for demo users and fallbacks
async function resolveUserProfile(email: string, userId: string): Promise<{ name: string; role: string; avatarUrl: string }> {
  const normEmail = email.toLowerCase().trim();

  if (normEmail === 'admin@veterinariahd.com') {
    return {
      name: 'Dr. Fernando Delgado',
      role: 'Administrador',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL-QGH-WFTpd7iyuG5QNKGiwl_FsZOVTkWVutex4LxUjdxWcfMgCH1WJCBH9XwXKh7mqVw9etKolHgkeuGbZyQ5j2wZ9bSGT_DJvYPfUM8imx3DRlowiru0Ee6fYfXiAKJxkydbF5Pmmvv9jdu97CTlr6vfS-owOkQjh17M2HO5YFrhpzohrGF-AXqiaxosi-zCJ0RfDIT3tPFwHxV1rTrWk2IK-Gy5e4Aa0IRrgxKNWFKGRPbhPRF'
    };
  }

  if (normEmail === 'vet.montes@veterinariahd.com') {
    return {
      name: 'Dra. Sofía Montes',
      role: 'Veterinario',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
    };
  }

  if (normEmail === 'carlos.recepcion@veterinariahd.com') {
    return {
      name: 'Carlos Ramírez',
      role: 'Recepcionista',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    };
  }

  // Database lookup fallback
  try {
    const { data: profile } = await insforge.database
      .from('user_profiles')
      .select('full_name, roles(name)')
      .eq('user_id', userId)
      .single();

    if (profile) {
      const roleName = (profile.roles as unknown as { name: string })?.name || 'Usuario';
      return {
        name: profile.full_name || email.split('@')[0],
        role: roleName,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || email)}&background=0D9488&color=fff`
      };
    }
  } catch {
    // Ignore DB fetch errors, fallback below
  }

  const defaultName = email.split('@')[0];
  const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
  return {
    name: formattedName,
    role: 'Usuario',
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=0D9488&color=fff`
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      try {
        const user: UserSession = JSON.parse(savedSession);
        return {
          isAuthenticated: true,
          user,
          loading: false,
          error: null,
          failedAttempts: 0,
          isLocked: false
        };
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      failedAttempts: 0,
      isLocked: false
    };
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

      // Resolve profile dynamically
      const profile = await resolveUserProfile(normalizedEmail, data.user.id);

      const userSession: UserSession = {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        role: profile.role,
        avatarUrl: profile.avatarUrl,
        token: data.accessToken
      };

      // Persist in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession));

      failedAttemptsMap.delete(normalizedEmail);
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
    localStorage.removeItem(STORAGE_KEY);
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

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
};
