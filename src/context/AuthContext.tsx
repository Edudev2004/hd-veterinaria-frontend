import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  RegisterPayload,
  LoginPayload,
  UpdateProfilePayload,
  registerOwner,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateProfile,
} from "@/services/authService";

interface AuthContextType {
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (payload: RegisterPayload) => Promise<User>;
  login: (payload: LoginPayload) => Promise<User>;
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
  }, []);

  const register = async (payload: RegisterPayload): Promise<User> => {
    const sessionUser = await registerOwner(payload);
    setUser(sessionUser);
    return sessionUser;
  };

  const login = async (payload: LoginPayload): Promise<User> => {
    const sessionUser = await loginUser(payload);
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };
  const updateUserProfile = async (
    payload: UpdateProfilePayload,
  ): Promise<User> => {
    if (!user) {
      throw new Error("No hay sesión activa.");
    }
    const updatedUser = await updateProfile(user.id, payload);
    setUser(updatedUser);
    return updatedUser;
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        updateProfile: updateUserProfile,
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
