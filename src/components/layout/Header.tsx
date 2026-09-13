import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  unreadNotifications?: number;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Carlos',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  unreadNotifications = 2
}) => {
  return (
    <header className="sticky top-0 bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-200/60 z-30 px-6 py-4 flex items-center justify-between transition-all">
      {/* Greeting Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-outfit">
          Hola, {userName}
        </h2>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Icon */}
        <button
          className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-full transition-all"
          title="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* User Avatar Circle */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <img
            src={userAvatar}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};
