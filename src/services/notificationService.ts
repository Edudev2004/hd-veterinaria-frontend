import { Notificacion } from '../features/notifications/notification';

const STORAGE_KEY = 'hd_veterinaria_notificaciones';

// Datos iniciales de prueba (mock data) con nombres de usuarios reales
const initialNotifications: Notificacion[] = [
  {
    id: '1',
    usuario_id: 'carlos-gomez',
    mensaje: 'Su cita para "Max" ha sido programada con éxito para mañana a las 10:00 AM.',
    tipo: 'cita',
    leido: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    usuario_id: 'carlos-gomez',
    mensaje: 'Recuerde traer la cartilla de vacunación en su próxima visita.',
    tipo: 'recordatorio',
    leido: false,
    created_at: new Date().toISOString(),
  },
];

export const notificationService = {
  // Obtener todas las notificaciones
  obtenerNotificaciones(): Notificacion[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
      return initialNotifications;
    }
    return JSON.parse(data);
  },

  // Marcar una notificación como leída
  marcarComoLeida(id: string): Notificacion[] {
    const notificaciones = this.obtenerNotificaciones();
    const actualizadas = notificaciones.map((notif) =>
      notif.id === id ? { ...notif, leido: true } : notif
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
    return actualizadas;
  },

  // Marcar todas como leídas
  marcarTodasComoLeidas(): Notificacion[] {
    const notificaciones = this.obtenerNotificaciones();
    const actualizadas = notificaciones.map((notif) => ({ ...notif, leido: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
    return actualizadas;
  }
};