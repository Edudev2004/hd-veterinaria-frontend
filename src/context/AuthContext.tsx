import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  RegisterPayload,
  LoginPayload,
  registerOwner,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (payload: RegisterPayload) => Promise<User>;
  login: (payload: LoginPayload, remember?: boolean) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = getCurrentUser();
    if (session) {
      setUser(session);
    }
    setIsLoading(false);

    // El cliente HTTP limpia la sesión y avisa cuando el backend responde 401.
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("vethd:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("vethd:unauthorized", handleUnauthorized);
    };
  }, []);

  const register = async (payload: RegisterPayload): Promise<User> => {
    const sessionUser = await registerOwner(payload);
    setUser(sessionUser);
    return sessionUser;
  };

  const login = async (
    payload: LoginPayload,
    remember = true,
  ): Promise<User> => {
    const sessionUser = await loginUser(payload, remember);
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
