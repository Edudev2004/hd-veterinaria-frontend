import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Stethoscope, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { NotificationDropdown } from '@/features/notifications/components/notificationdropdown';

interface HeaderProps {
  userName?: string;
  userAvatar?: string; 
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Carlos',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Nombre real del usuario en sesión o fallback
  const displayName = user?.nombre ? user.nombre.split(' ')[0] : userName;
  const fullName = user?.nombre || userName;

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 600);
  };

  // Etiqueta y estilo visual según el rol
  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.rol) {
      case 'veterinario':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-[#0D7C84] border border-[#0D7C84]/30">
            <Stethoscope className="w-3 h-3" />
            <span>Médico Veterinario</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-[#d97706] border border-[#F59E0B]/40">
            <ShieldCheck className="w-3 h-3" />
            <span>Administrador</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <UserIcon className="w-3 h-3 text-[#0D7C84]" />
            <span>Propietario</span>
          </span>
        );
    }
  };

  return (
    <>
      {/* Loader de cierre de sesión */}
      <LoadingOverlay visible={isLoggingOut} message="Cerrando sesión de forma segura..." />

      {/* Modal de confirmación al cerrar sesión */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="¿Cerrar Sesión?"
        description="¿Estás seguro de que deseas salir del sistema? Tendrás que volver a ingresar tus credenciales para acceder a tus datos."
        confirmText="Sí, Cerrar Sesión"
        cancelText="Cancelar"
        variant="danger"
      />

      <header className="sticky top-0 bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-200/60 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        {/* Greeting Title & Role Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-outfit">
            Hola, {displayName}
          </h2>
          {getRoleBadge()}
        </div>

        {/* Right Controls: Notifications, Profile & Visible Logout Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Bell Icon con el rol actual */}
          <NotificationDropdown role={user?.rol || 'propietario'} />

          {/* User Info (Avatar + Name) */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
            <img
              src={userAvatar}
              alt={fullName}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-slate-200 shadow-sm"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                {fullName}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
                {user?.rol || 'Usuario'}
              </span>
            </div>
          </div>

          {/* US-03: Botón 'Cerrar sesión' visible en navbar en todo momento con confirmación */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/90 border border-rose-200/80 transition-all active:scale-95 cursor-pointer shadow-xs"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Cerrar Sesión</span>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
