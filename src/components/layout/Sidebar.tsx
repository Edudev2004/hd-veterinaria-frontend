import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  User,
  Plus,
  LogOut,
  Stethoscope,
  Bell,
  Star,
  ClipboardList,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';

export type PortalType = 'propietario' | 'veterinario' | 'admin';

interface SidebarProps {
  onNewAppointmentClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewAppointmentClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activePortal, setActivePortal] = useState<PortalType>('propietario');
  const [isPortalMenuOpen, setIsPortalMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-select active portal based on route path
  React.useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      setActivePortal('admin');
    } else if (location.pathname.startsWith('/veterinario')) {
      setActivePortal('veterinario');
    } else {
      setActivePortal('propietario');
    }
  }, [location.pathname]);

  // Menu items configuration per portal perspective (Mapped from Jira HGV-8 to HGV-41)
  const navPortals = {
    propietario: {
      title: 'Portal Propietario',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Mis Mascotas', path: '/mascotas', icon: PawPrint },
        { name: 'Mis Citas', path: '/citas', icon: Calendar },
        { name: 'Notificaciones', path: '/notificaciones', icon: Bell },
        { name: 'Valoraciones', path: '/valoraciones', icon: Star },
        { name: 'Perfil', path: '/perfil', icon: User }
      ]
    },
    veterinario: {
      title: 'Panel Veterinario',
      items: [
        { name: 'Agenda Diaria', path: '/veterinario/agenda', icon: Calendar },
        { name: 'Atenciones', path: '/veterinario/atenciones', icon: Stethoscope },
        { name: 'Historial Clínico', path: '/veterinario/historial', icon: ClipboardList },
        { name: 'Mis Valoraciones', path: '/veterinario/valoraciones', icon: Award }
      ]
    },
    admin: {
      title: 'Panel Administración',
      items: [
        { name: 'Estadísticas', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Veterinarios', path: '/admin/veterinarios', icon: Users },
        { name: 'Especialidades', path: '/admin/especialidades', icon: Layers },
        { name: 'Roles y Permisos', path: '/admin/roles', icon: ShieldCheck },
        { name: 'Reportes', path: '/admin/reportes', icon: FileSpreadsheet }
      ]
    }
  };

  const currentNav = navPortals[activePortal];

  const handlePortalSwitch = (portal: PortalType) => {
    setActivePortal(portal);
    setIsPortalMenuOpen(false);
    if (portal === 'propietario') navigate('/dashboard');
    if (portal === 'veterinario') navigate('/veterinario/agenda');
    if (portal === 'admin') navigate('/admin/dashboard');
  };

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPortalMenuOpen(false);
      }}
      className={`hidden md:flex fixed top-0 left-0 h-screen bg-[#edf2fa] border-r border-slate-200/80 z-40 transition-all duration-300 ease-in-out flex-col justify-between p-4 shadow-sm ${
        isHovered ? 'w-64' : 'w-20'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-5">
        {/* Branding */}
        <div className="flex items-center gap-3 px-2 pt-2 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[#0d9488] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-700/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div
            className={`transition-opacity duration-200 whitespace-nowrap ${
              isHovered ? 'opacity-100' : 'opacity-0 w-0'
            }`}
          >
            <h1 className="text-xl font-bold text-slate-900 leading-tight font-outfit">
              Vet<span className="text-[#0d9488]">HD</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Plataforma Clínica</p>
          </div>
        </div>

        {/* Portal Switcher Dropdown (Only visible when expanded) */}
        {isHovered && (
          <div className="relative px-1">
            <button
              onClick={() => setIsPortalMenuOpen(!isPortalMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-xs"
            >
              <span>{currentNav.title}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {isPortalMenuOpen && (
              <div className="absolute top-full left-1 right-1 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 flex flex-col">
                <button
                  onClick={() => handlePortalSwitch('propietario')}
                  className={`px-3 py-2 text-left text-xs font-medium hover:bg-slate-50 ${
                    activePortal === 'propietario' ? 'text-[#0d9488] font-bold' : 'text-slate-700'
                  }`}
                >
                  Portal Propietario
                </button>
                <button
                  onClick={() => handlePortalSwitch('veterinario')}
                  className={`px-3 py-2 text-left text-xs font-medium hover:bg-slate-50 ${
                    activePortal === 'veterinario' ? 'text-[#0d9488] font-bold' : 'text-slate-700'
                  }`}
                >
                  Panel Veterinario
                </button>
                <button
                  onClick={() => handlePortalSwitch('admin')}
                  className={`px-3 py-2 text-left text-xs font-medium hover:bg-slate-50 ${
                    activePortal === 'admin' ? 'text-[#0d9488] font-bold' : 'text-slate-700'
                  }`}
                >
                  Panel Administración
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Navigation List */}
        <nav className="flex flex-col gap-1.5 mt-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          {currentNav.items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 overflow-hidden ${
                    isActive
                      ? 'bg-[#f59e0b] text-white shadow-md shadow-amber-500/25'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`
                }
                title={!isHovered ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`transition-opacity duration-200 whitespace-nowrap ${
                    isHovered ? 'opacity-100' : 'opacity-0 w-0 hidden'
                  }`}
                >
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3">
        {/* Action Button: + Nueva Cita */}
        <button
          onClick={onNewAppointmentClick || (() => navigate('/citas?action=new'))}
          className={`flex items-center justify-center gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white font-medium py-3 rounded-full shadow-md shadow-teal-700/20 transition-all duration-200 overflow-hidden ${
            isHovered ? 'px-4 w-full' : 'px-0 w-12 h-12 self-center'
          }`}
          title={!isHovered ? 'Nueva Cita' : undefined}
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap ${
              isHovered ? 'opacity-100' : 'opacity-0 w-0 hidden'
            }`}
          >
            Nueva Cita
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150 overflow-hidden ${
            !isHovered ? 'justify-center' : ''
          }`}
          title={!isHovered ? 'Cerrar Sesión' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap ${
              isHovered ? 'opacity-100' : 'opacity-0 w-0 hidden'
            }`}
          >
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
};
