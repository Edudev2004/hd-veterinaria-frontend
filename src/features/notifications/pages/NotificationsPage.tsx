import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, Clock, User, Heart } from 'lucide-react';
import { notificationService, RecordatorioCita } from '../../../services/notificationService';

export const NotificationsPage: React.FC = () => {
  const [reminders, setReminders] = useState<RecordatorioCita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReminders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setReminders(await notificationService.obtenerRecordatorios());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los recordatorios.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReminders();
  }, [loadReminders]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">Notificaciones y Recordatorios</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-base font-bold text-slate-800">Citas en las próximas 24 horas</h3>
            <p className="text-xs text-slate-500">Recordatorios asociados a tus citas próximas.</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <p>{error}</p>
            <button type="button" onClick={() => void loadReminders()} className="mt-2 text-xs font-bold underline">
              Reintentar
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="py-6 text-center text-sm text-slate-500">Cargando recordatorios...</p>
        ) : error ? null : reminders.length === 0 ? (
          <p className="text-xs text-slate-500">No tienes citas en las próximas 24 horas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reminders.map((appointment) => {
              const date = new Date(appointment.scheduledAt);
              return (
                <div
                  key={appointment.id}
                  className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      {date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} ·{' '}
                      {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                    {appointment.service}
                  </span>

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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
