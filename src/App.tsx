import React, { useState } from 'react';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RolesPage } from './features/roles/pages/RolesPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<'auth' | 'roles'>('roles');

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Demo Navigation Bar */}
      <nav className="bg-dark-slate text-white px-6 py-3 flex items-center justify-between shadow-md border-b border-slate-800 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400 text-[24px]">pets</span>
          <span className="font-heading font-bold text-base tracking-tight">Veterinaria HD</span>
          <span className="text-[10px] bg-slate-800 text-emerald-400 border border-slate-700 px-2 py-0.5 rounded-full font-semibold">
            ÉPICA 1: Acceso y Usuarios
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('auth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'auth'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>HU-01: Autenticación</span>
          </button>

          <button
            onClick={() => setCurrentTab('roles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'roles'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>HU-02: Roles y Permisos</span>
          </button>
        </div>
      </nav>

      {/* Main View */}
      <main className="flex-1">
        {currentTab === 'auth' && <LoginPage />}
        {currentTab === 'roles' && <RolesPage />}
      </main>
    </div>
  );
}

export default App;
