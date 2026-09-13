import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar despliege automático por Hover (Solo Desktop) */}
      <Sidebar />

      {/* Area principal de contenido */}
      <div className="flex-1 flex flex-col pl-0 md:pl-20 transition-all duration-300 min-w-0 pb-28 md:pb-8">
        <Header userName="Carlos" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Menú inferior flotante con indicador elevado (Solo Móvil) */}
      <BottomNav />
    </div>
  );
};
