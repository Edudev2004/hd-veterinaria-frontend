import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-10 h-10 border-4 border-[#0D7C84] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 tracking-wide">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // Si el usuario no está autenticado, redirigir a la pantalla de login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
