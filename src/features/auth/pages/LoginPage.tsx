import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { Button } from '../../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, user, loading, error, isLocked, login, logout } = useAuth();

  const logoUrl = 'https://lh3.googleusercontent.com/aida/AEtjO1VCc64tB3YZugjZgTfq2fv9QeeBgaM54ZmDS9fZTaNM2DhxonXTMCZGPoQagZ6JniSuWwSxVB3UkB9oJzGOrXEqY22oT8ViputscjnDKz5WsLSXmy8994Jcke63GDtzdAnPn3sLiXAnJnFZXDapolCp7zQKg3f7-dj7GgaS56jxBgZRmpHO_NwXEVfSk52MYU1seremDCio-bt_aoNsH5mz196dGtAU0ia6aDkBACpl1s51q5_CMgd1c64';

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <header className="w-full max-w-md flex items-center justify-between mb-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm border border-slate-200">
            <img src={logoUrl} alt="Veterinaria HD Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-dark-slate leading-tight">Veterinaria HD</h1>
            <span className="text-xs text-slate-500 font-medium">Gestión Clínica Inteligente</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          v3.4 Activo
        </span>
      </header>

      {/* Main Content Card / Form */}
      <main className="z-10 w-full flex justify-center">
        {isAuthenticated ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 w-full max-w-md text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">verified_user</span>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-dark-slate">¡Bienvenido de nuevo!</h2>
              <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
            </div>
            <div className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              Sesión Autenticada con InsForge SDK
            </div>
            <Button variant="outline" icon="logout" onClick={logout} className="w-full mt-2">
              Cerrar Sesión
            </Button>
          </div>
        ) : (
          <LoginForm
            onLogin={login}
            loading={loading}
            error={error}
            isLocked={isLocked}
          />
        )}
      </main>

      {/* Footer copyright */}
      <footer className="mt-8 text-xs text-slate-400 font-medium z-10 text-center">
        Veterinaria HD &copy; 2026 • Sistema Clínico de Alta Definición
      </footer>
    </div>
  );
};
