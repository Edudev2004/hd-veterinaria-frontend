import React from 'react';
import { Calendar, Clock, User, Heart } from 'lucide-react';

// Datos mock para los recordatorios de citas próximas
const upcomingAppointmentReminders = [
  {
    id: '1',
    service: 'Vacunación Anual',
    petName: 'Luna',
    vetName: 'Dra. Laura',
    day: '15',
    month: 'OCT',
    time: '10:00 AM',
  },
  {
    id: '2',
    service: 'Revisión Dental',
    petName: 'Max',
    vetName: 'Dra. Laura',
    day: '22',
    month: 'OCT',
    time: '04:30 PM',
  },
];

export const NotificationsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">Notificaciones y Recordatorios</h1>
      </div>

      {/* Sección de Recordatorios de Citas Próximas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-slate-800">Próximas Citas</h3>
        </div>

        {upcomingAppointmentReminders.length === 0 ? (
          <p className="text-xs text-slate-500">No hay citas programadas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointmentReminders.map((appointment) => (
              <div 
                key={appointment.id} 
                className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    {appointment.day} de {appointment.month} - {appointment.time}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {appointment.day} {appointment.month}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                    {appointment.service}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 pt-1 border-t border-amber-100/60">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Mascota: <strong>{appointment.petName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>Vet: <strong>{appointment.vetName}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};