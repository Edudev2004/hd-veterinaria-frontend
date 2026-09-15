import { Notificacion } from '../features/notifications/notification';

// Datos iniciales específicos para cada rol
const mockNotificationsByRole: Record<string, Notificacion[]> = {
  propietario: [
    {
      id: '1',
      usuario_id: 'propietario',
      mensaje: 'Su cita para "Max" ha sido programada con éxito para mañana a las 10:00 AM.',
      tipo: 'cita',
      leido: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      usuario_id: 'propietario',
      mensaje: 'Recuerde traer la cartilla de vacunación en su próxima visita.',
      tipo: 'recordatorio',
      leido: false,
      created_at: new Date().toISOString(),
    },
  ],
  veterinario: [
    {
      id: '3',
      usuario_id: 'veterinario',
      mensaje: 'Nueva cita asignada con el paciente "Luna" a las 11:30 AM.',
      tipo: 'cita',
      leido: false,
      created_at: new Date().toISOString(),
    },
  ],
  admin: [
    {
      id: '4',
      usuario_id: 'admin',
      mensaje: 'Se ha registrado un nuevo usuario en el sistema.',
      tipo: 'sistema',
      leido: false,
      created_at: new Date().toISOString(),
    },
  ],
};

const getStorageKey = (role: string = 'propietario') => `hd_veterinaria_notificaciones_${role}`;

export const notificationService = {
  obtenerNotificaciones(role: string = 'propietario'): Notificacion[] {
    const STORAGE_KEY = getStorageKey(role);
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
      const initialData = mockNotificationsByRole[role] || mockNotificationsByRole['propietario'];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(data);
  },

  marcarComoLeida(id: string, role: string = 'propietario'): Notificacion[] {
    const STORAGE_KEY = getStorageKey(role);
    const notificaciones = this.obtenerNotificaciones(role);
    const actualizadas = notificaciones.map((notif) =>
      notif.id === id ? { ...notif, leido: true } : notif
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
    return actualizadas;
  },

  marcarTodasComoLeidas(role: string = 'propietario'): Notificacion[] {
    const STORAGE_KEY = getStorageKey(role);
    const notificaciones = this.obtenerNotificaciones(role);
    const actualizadas = notificaciones.map((notif) => ({ ...notif, leido: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
    return actualizadas;
  }
};