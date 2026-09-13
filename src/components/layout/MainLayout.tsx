import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Sidebar despliege automático por Hover */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-20 transition-all duration-300 min-w-0">
        <Header userName="Carlos" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
