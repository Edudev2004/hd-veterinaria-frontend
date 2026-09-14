import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, RegisterPayload, registerOwner, getCurrentUser, logoutUser } from '@/services/authService';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  register: (payload: RegisterPayload) => Promise<Usuario>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const session = getCurrentUser();
    if (session) {
      setUser(session);
    }
  }, []);

  const register = async (payload: RegisterPayload) => {
    const sessionUser = await registerOwner(payload);
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
