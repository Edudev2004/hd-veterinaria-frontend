import React, { useCallback, useEffect, useState } from 'react';
import { Bell, Calendar, CheckCheck, Clock, Heart, User, AlertCircle } from 'lucide-react';
import { notificationService, RecordatorioCita } from '../../../services/notificationService';
import { Notificacion } from '../notification';

type TabFiltro = 'todas' | 'no_leidas';

export const NotificationsPage: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [recordatorios, setReminders] = useState<RecordatorioCita[]>([]);
  const [filtro, setFiltro] = useState<TabFiltro>('todas');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [notifs, recs] = await Promise.all([
        notificationService.obtenerNotificaciones().catch(() => []),
        notificationService.obtenerRecordatorios().catch(() => [])
      ]);
      setNotificaciones(notifs);
      setReminders(recs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las notificaciones.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const handleMarcarLeida = async (id: string) => {
    try {
      await notificationService.marcarComoLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
      );
    } catch {
      // fallo silencioso
    }
  };

  const handleMarcarTodas = async () => {
    setIsUpdating(true);
    try {
      await notificationService.marcarTodasComoLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
    } catch {
      // fallo silencioso
    } finally {
      setIsUpdating(false);
    }
  };

  const noLeidasCount = notificaciones.filter((n) => !n.leido).length;
  const notificacionesFiltradas = filtro === 'no_leidas'
    ? notificaciones.filter((n) => !n.leido)
    : notificaciones;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">Notificaciones y Recordatorios</h1>
        <p className="text-sm text-slate-500">
          Revisa las novedades de tus atenciones y los avisos de tus citas programadas.
        </p>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p>{error}</p>
            <button type="button" onClick={() => void cargarDatos()} className="mt-1 text-xs font-bold underline">
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* 1. Sección de Notificaciones */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-800">
              Notificaciones ({notificaciones.length})
            </h2>
            {noLeidasCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {noLeidasCount} {noLeidasCount === 1 ? 'nueva' : 'nuevas'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filtros */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setFiltro('todas')}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  filtro === 'todas' ? 'bg-white font-semibold text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setFiltro('no_leidas')}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  filtro === 'no_leidas' ? 'bg-white font-semibold text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                No leídas ({noLeidasCount})
              </button>
            </div>

            {noLeidasCount > 0 && (
              <button
                type="button"
                onClick={() => void handleMarcarTodas()}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 disabled:opacity-50 ml-2"
              >
                <CheckCheck className="w-4 h-4" />
                Marcar todas
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <p className="py-6 text-center text-sm text-slate-500">Cargando notificaciones...</p>
        ) : notificacionesFiltradas.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">
            {filtro === 'no_leidas' ? (
              <p>No tienes notificaciones pendientes por leer.</p>
            ) : (
              <p>No tienes notificaciones registradas en tu historial.</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notificacionesFiltradas.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.leido && void handleMarcarLeida(notif.id)}
                className={`py-3 px-3 rounded-xl transition-colors flex items-start gap-3 ${
                  notif.leido
                    ? 'bg-white opacity-80'
                    : 'bg-amber-50/50 hover:bg-amber-50 cursor-pointer'
                }`}
              >
                <span
                  className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                    notif.leido ? 'bg-slate-200' : 'bg-amber-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900">
                      {notif.titulo || 'Notificación'}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {new Date(notif.created_at).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{notif.mensaje}</p>
                </div>
                {!notif.leido && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleMarcarLeida(notif.id);
                    }}
                    className="text-[11px] text-amber-600 hover:text-amber-700 font-medium whitespace-nowrap self-center"
                  >
                    Marcar leída
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Sección de Recordatorios (Próximas 24 horas) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="w-5 h-5 text-amber-600" />
          <div>
            <h2 className="text-base font-bold text-slate-800">Citas en las próximas 24 horas</h2>
            <p className="text-xs text-slate-500">Recordatorios de citas médicas próximas.</p>
          </div>
        </div>

        {isLoading ? (
          <p className="py-6 text-center text-sm text-slate-500">Cargando recordatorios...</p>
        ) : recordatorios.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">No tienes citas en las próximas 24 horas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recordatorios.map((appointment) => {
              const date = new Date(appointment.scheduledAt);
              return (
                <div
                  key={appointment.id}
                  className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      {date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })} ·{' '}
                      {date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                      Próxima 24h
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
