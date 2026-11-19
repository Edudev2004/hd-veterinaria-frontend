import React, { useState, useEffect, useCallback } from 'react';
import { Notificacion } from '../notification';
import { notificationService } from '../../../services/notificationService';

export const NotificationDropdown: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [noLeidasCount, setNoLeidasCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const cargarNotificaciones = useCallback(async () => {
    setError(null);
    try {
      const [data, count] = await Promise.all([
        notificationService.obtenerNotificaciones(),
        notificationService.obtenerConteoNoLeidas()
      ]);
      setNotificaciones(data);
      setNoLeidasCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las notificaciones.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarNotificaciones();

    const handleSync = () => {
      void cargarNotificaciones();
    };

    window.addEventListener('notifications-updated', handleSync);
    return () => {
      window.removeEventListener('notifications-updated', handleSync);
    };
  }, [cargarNotificaciones]);

  const handleMarcarLeida = async (id: string) => {
    setIsUpdating(true);
    try {
      await notificationService.marcarComoLeida(id);
      await cargarNotificaciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la notificación.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarcarTodas = async () => {
    setIsUpdating(true);
    try {
      await notificationService.marcarTodasComoLeidas();
      await cargarNotificaciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron actualizar las notificaciones.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      {/* Botón de la campanita */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
        aria-label="Notificaciones"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {noLeidasCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
            {noLeidasCount}
          </span>
        )}
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-gray-100 py-3 z-50">
          <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Notificaciones</h3>
            {noLeidasCount > 0 && (
              <button
                onClick={() => void handleMarcarTodas()}
                disabled={isUpdating}
                className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {error && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50">
                <p>{error}</p>
                <button type="button" onClick={() => void cargarNotificaciones()} className="mt-1 font-semibold underline">
                  Reintentar
                </button>
              </div>
            )}
            {isLoading ? (
              <p className="py-6 text-center text-sm text-gray-500">Cargando notificaciones...</p>
            ) : error ? null : notificaciones.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">No hay notificaciones</p>
            ) : (
              notificaciones.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.leido && !isUpdating && void handleMarcarLeida(notif.id)}
                  className={`p-4 transition-colors cursor-pointer flex gap-3 items-start ${
                    notif.leido ? 'bg-white opacity-70' : 'bg-amber-50/40 hover:bg-amber-50/70'
                  }`}
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                      notif.leido ? 'bg-transparent' : 'bg-amber-500'
                    }`}
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 leading-snug">{notif.mensaje}</p>
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};