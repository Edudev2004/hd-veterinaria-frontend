import React, { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeModule: 'roles' | 'users' | 'login';
  onNavigate: (module: 'roles' | 'users' | 'login') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeModule,
  onNavigate
}) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const logoUrl = 'https://lh3.googleusercontent.com/aida/AEtjO1VCc64tB3YZugjZgTfq2fv9QeeBgaM54ZmDS9fZTaNM2DhxonXTMCZGPoQagZ6JniSuWwSxVB3UkB9oJzGOrXEqY22oT8ViputscjnDKz5WsLSXmy8994Jcke63GDtzdAnPn3sLiXAnJnFZXDapolCp7zQKg3f7-dj7GgaS56jxBgZRmpHO_NwXEVfSk52MYU1seremDCio-bt_aoNsH5mz196dGtAU0ia6aDkBACpl1s51q5_CMgd1c64';

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL-QGH-WFTpd7iyuG5QNKGiwl_FsZOVTkWVutex4LxUjdxWcfMgCH1WJCBH9XwXKh7mqVw9etKolHgkeuGbZyQ5j2wZ9bSGT_DJvYPfUM8imx3DRlowiru0Ee6fYfXiAKJxkydbF5Pmmvv9jdu97CTlr6vfS-owOkQjh17M2HO5YFrhpzohrGF-AXqiaxosi-zCJ0RfDIT3tPFwHxV1rTrWk2IK-Gy5e4Aa0IRrgxKNWFKGRPbhPRF';

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-dark-slate">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Alternar menú lateral"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('users')}>
            <img src={logoUrl} alt="Veterinaria HD Logo" className="h-8 w-auto object-contain" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base text-dark-slate leading-tight">
                  Veterinaria HD
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Clínica Central
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Software Clínico</span>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Dynamic User Profile Header */}
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatarUrl || defaultAvatar}
              alt={user?.name || "Perfil"}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs bg-slate-100"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-dark-slate">{user?.name || 'Dr. Fernando Delgado'}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">{user?.role || 'Administrador'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Area: Sidebar + Main Content */}
      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <aside
          className={`w-64 bg-dark-slate text-white border-r border-slate-800 flex flex-col transition-all duration-300 z-30 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
          }`}
        >
          <div className="p-4 flex flex-col gap-1 flex-1">
            <div className="text-[11px] font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">
              {isSidebarOpen ? 'Administración' : '•'}
            </div>

            {/* Menu Option 1: Roles y Permisos */}
            <button
              onClick={() => onNavigate('roles')}
              className={`w-full px-3 py-2.5 rounded-xl font-heading font-semibold text-sm flex items-center gap-3 transition-colors ${
                activeModule === 'roles'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              {isSidebarOpen && <span>Roles y Permisos</span>}
            </button>

            {/* Menu Option 2: Usuarios del Sistema */}
            <button
              onClick={() => onNavigate('users')}
              className={`w-full px-3 py-2.5 rounded-xl font-heading font-semibold text-sm flex items-center gap-3 transition-colors ${
                activeModule === 'users'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">badge</span>
              {isSidebarOpen && <span>Usuarios del Sistema</span>}
            </button>

            <div className="text-[11px] font-bold text-slate-400 px-3 pt-6 pb-2 uppercase tracking-wider">
              {isSidebarOpen ? 'Gestión Clínica' : '•'}
            </div>

            {/* Menu Option 3: Clientes y Mascotas (Próximamente) */}
            <button
              disabled
              className="w-full px-3 py-2.5 rounded-xl font-heading font-semibold text-sm flex items-center justify-between text-slate-500 opacity-60 cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">pets</span>
                {isSidebarOpen && <span>Clientes y Mascotas</span>}
              </div>
              {isSidebarOpen && <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded font-mono">ÉPICA 2</span>}
            </button>

            {/* Menu Option 4: Citas (Próximamente) */}
            <button
              disabled
              className="w-full px-3 py-2.5 rounded-xl font-heading font-semibold text-sm flex items-center justify-between text-slate-500 opacity-60 cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                {isSidebarOpen && <span>Citas y Agenda</span>}
              </div>
              {isSidebarOpen && <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded font-mono">ÉPICA 3</span>}
            </button>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            {isSidebarOpen ? (
              <>
                <span>Veterinaria HD v3.4</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </>
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" />
            )}
          </div>
        </aside>

        {/* Main View Workspace */}
        <main className="flex-1 bg-surface min-h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
