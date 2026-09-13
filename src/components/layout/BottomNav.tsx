import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  User,
  Bell,
  Stethoscope,
  ClipboardList,
  Users,
  Layers,
  ShieldCheck,
  FileSpreadsheet,
  Award,
  ChevronUp
} from 'lucide-react';
import { PortalType } from './Sidebar';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePortal, setActivePortal] = useState<PortalType>('propietario');
  const [showPortalSelector, setShowPortalSelector] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      setActivePortal('admin');
    } else if (location.pathname.startsWith('/veterinario')) {
      setActivePortal('veterinario');
    } else {
      setActivePortal('propietario');
    }
  }, [location.pathname]);

  const navPortals = {
    propietario: [
      { name: 'Inicio', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Mascotas', path: '/mascotas', icon: PawPrint },
      { name: 'Citas', path: '/citas', icon: Calendar },
      { name: 'Notif.', path: '/notificaciones', icon: Bell },
      { name: 'Perfil', path: '/perfil', icon: User }
    ],
    veterinario: [
      { name: 'Agenda', path: '/veterinario/agenda', icon: Calendar },
      { name: 'Atención', path: '/veterinario/atenciones', icon: Stethoscope },
      { name: 'Historial', path: '/veterinario/historial', icon: ClipboardList },
      { name: 'Opiniones', path: '/veterinario/valoraciones', icon: Award }
    ],
    admin: [
      { name: 'Inicio', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Vets', path: '/admin/veterinarios', icon: Users },
      { name: 'Espec.', path: '/admin/especialidades', icon: Layers },
      { name: 'Roles', path: '/admin/roles', icon: ShieldCheck },
      { name: 'Reportes', path: '/admin/reportes', icon: FileSpreadsheet }
    ]
  };

  const items = navPortals[activePortal];

  const handleSwitchPortal = (portal: PortalType) => {
    setActivePortal(portal);
    setShowPortalSelector(false);
    if (portal === 'propietario') navigate('/dashboard');
    if (portal === 'veterinario') navigate('/veterinario/agenda');
    if (portal === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none pb-3 px-4">
      {/* Portal Switcher Modal for Mobile */}
      {showPortalSelector && (
        <div className="pointer-events-auto mb-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-2xl flex flex-col gap-2 animate-in slide-in-from-bottom-5">
          <div className="text-xs font-semibold text-slate-400 px-2 uppercase tracking-wider">
            Cambiar Rol
          </div>
          <button
            onClick={() => handleSwitchPortal('propietario')}
            className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-medium transition-all ${
              activePortal === 'propietario'
                ? 'bg-[#0d9488] text-white font-bold shadow-md shadow-teal-700/20'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Portal Propietario (Cliente)
          </button>
          <button
            onClick={() => handleSwitchPortal('veterinario')}
            className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-medium transition-all ${
              activePortal === 'veterinario'
                ? 'bg-[#0d9488] text-white font-bold shadow-md shadow-teal-700/20'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Panel Veterinario (Médico)
          </button>
          <button
            onClick={() => handleSwitchPortal('admin')}
            className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-medium transition-all ${
              activePortal === 'admin'
                ? 'bg-[#0d9488] text-white font-bold shadow-md shadow-teal-700/20'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Panel Administrador
          </button>
        </div>
      )}

      {/* Main Curved Pill Navigation Container */}
      <nav className="pointer-events-auto relative bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-2xl px-2 py-1.5 flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-300 group"
            >
              {/* Elevated Floating Active Circle Badge */}
              <div
                className={`flex items-center justify-center transition-all duration-300 ease-out ${
                  isActive
                    ? 'w-12 h-12 rounded-full bg-[#0d9488] text-white shadow-xl shadow-teal-600/40 ring-4 ring-[#f8fafc] -translate-y-5 scale-110'
                    : 'w-8 h-8 text-slate-400 group-hover:text-slate-600 translate-y-0 scale-100'
                }`}
              >
                <Icon className={isActive ? 'w-6 h-6' : 'w-5 h-5'} />
              </div>

              {/* Item Label */}
              <span
                className={`text-[10px] font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-[#0d9488] -translate-y-3 font-bold scale-105'
                    : 'text-slate-500 translate-y-0'
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}

        {/* Portal Switcher Button at end */}
        <button
          onClick={() => setShowPortalSelector(!showPortalSelector)}
          className="relative flex flex-col items-center justify-center px-2 py-1.5 text-slate-400 hover:text-slate-700 transition-colors"
          title="Cambiar Vista"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-xs">
            <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${showPortalSelector ? 'rotate-180' : ''}`} />
          </div>
          <span className="text-[10px] font-semibold text-slate-400">Rol</span>
        </button>
      </nav>
    </div>
  );
};
