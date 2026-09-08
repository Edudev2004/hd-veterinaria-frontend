import React from 'react';

interface DemoRoleSelectorProps {
  onSelect: (email: string, pass: string) => void;
}

export const DemoRoleSelector: React.FC<DemoRoleSelectorProps> = ({ onSelect }) => {
  const demoUsers = [
    {
      role: 'Admin',
      name: 'Dr. Delgado',
      email: 'admin@veterinariahd.com',
      icon: 'local_hospital',
      color: 'text-primary'
    },
    {
      role: 'Veterinario',
      name: 'Dra. Montes',
      email: 'vet.montes@veterinariahd.com',
      icon: 'pets',
      color: 'text-sky-600'
    },
    {
      role: 'Recepción',
      name: 'Carlos R.',
      email: 'carlos.recepcion@veterinariahd.com',
      icon: 'calendar_month',
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="mt-6 pt-4 bg-surface-low rounded-xl p-3 border border-slate-200/80 flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">tune</span>
          Perfiles de Prueba Rápida
        </span>
        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
          1-Click Demo
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {demoUsers.map((user) => (
          <button
            key={user.email}
            type="button"
            onClick={() => onSelect(user.email, 'ClaveSegura2026')}
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-primary hover:bg-emerald-50/50 active:scale-95 transition-all text-center group"
          >
            <span className={`material-symbols-outlined text-[20px] ${user.color} group-hover:scale-110 transition-transform`}>
              {user.icon}
            </span>
            <span className="text-[11px] font-semibold text-dark-slate mt-1">{user.role}</span>
            <span className="text-[10px] text-slate-400 truncate max-w-full">{user.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
