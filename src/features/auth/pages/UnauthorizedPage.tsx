import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, LogOut, Home, Stethoscope } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Determinar la ruta autorizada según el rol del usuario
  const getAuthorizedPath = () => {
    if (!user) return '/login';
    switch (user.rol) {
      case 'veterinario':
        return '/veterinario/agenda';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getRoleLabel = () => {
    if (!user) return 'Invitado / No autenticado';
    switch (user.rol) {
      case 'veterinario':
        return 'Médico Veterinario';
      case 'admin':
        return 'Administrador';
      default:
        return 'Propietario de Mascota';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800 p-6 sm:p-12 selection:bg-[#0D7C84] selection:text-white">
      {/* Header Logo */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0D7C84] p-0.5 shadow-lg shadow-[#0D7C84]/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-[#0D7C84]" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Vet<span className="text-[#F59E0B]">HD</span>
          </span>
        </Link>

        {user && (
          <div className="text-right">
            <span className="text-xs font-medium text-slate-400 block">Sesión actual:</span>
            <span className="text-xs font-bold text-slate-700">{user.email}</span>
          </div>
        )}
      </header>

      {/* Center Card */}
      <main className="max-w-lg w-full mx-auto my-auto bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 text-center space-y-6">
        {/* Shield Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Error Code & Title */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
            Error 403 • Acceso Restringido
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-outfit">
            Área No Autorizada
          </h1>
        </div>

        {/* Informative description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          Tu cuenta está registrada con el rol de{' '}
          <strong className="text-slate-900 font-bold underline decoration-[#0D7C84] decoration-2">
            {getRoleLabel()}
          </strong>
          , por lo que no dispones de los permisos requeridos para acceder a esta sección.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-left text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">🛡️ Política de Seguridad de Roles (US-04):</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500">
            <li><strong>Propietario:</strong> Solo accede a su portal de mascotas y citas.</li>
            <li><strong>Veterinario:</strong> Solo accede a agenda médica y atenciones.</li>
            <li><strong>Administrador:</strong> Solo accede a gestión interna y reportes.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-3">
          <Button
            onClick={() => navigate(getAuthorizedPath())}
            variant="primary"
            fullWidth
            className="!py-3 shadow-md shadow-[#0D7C84]/20"
          >
            <span>Ir a mi Panel Autorizado</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cambiar de cuenta</span>
            </button>

            <span className="text-slate-300">•</span>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Inicio público</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 mt-6">
        © {new Date().getFullYear()} VetHD • Sistema Integral de Salud Veterinaria
      </footer>
    </div>
  );
};

export default UnauthorizedPage;
