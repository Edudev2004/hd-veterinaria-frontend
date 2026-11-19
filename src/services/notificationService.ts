import { apiRequestWithTimeout } from './apiClient';
import { Notificacion } from '../features/notifications/notification';

interface NotificationResponse {
  id: string;
  title: string | null;
  message: string;
  type: string;
  read: boolean;
  scheduledAt: string | null;
  createdAt: string;
}

interface UnreadCountResponse {
  noLeidas: number;
}

interface ReminderAppointmentResponse {
  id: string;
  pet: { name: string };
  veterinarian: { name: string };
  specialty: { name: string } | null;
  scheduledAt: string;
  reason: string | null;
}

export interface RecordatorioCita {
  id: string;
  service: string;
  petName: string;
  vetName: string;
  scheduledAt: string;
}

const toNotification = (notification: NotificationResponse): Notificacion => {
  const normalizedType = notification.type.toLowerCase();
  const tipo: Notificacion['tipo'] = normalizedType.includes('cita') || normalizedType.includes('appointment')
    ? 'cita'
    : normalizedType.includes('recordatorio') || normalizedType.includes('reminder')
      ? 'recordatorio'
      : 'sistema';

  return {
    id: notification.id,
    titulo: notification.title || undefined,
    mensaje: notification.message,
    tipo,
    leido: notification.read,
    created_at: notification.createdAt
  };
};

export const notificationService = {
  async obtenerNotificaciones(timeoutMs = 10000): Promise<Notificacion[]> {
    const notifications = await apiRequestWithTimeout<NotificationResponse[]>(
      '/api/notificaciones',
      {},
      timeoutMs
    );
    return notifications.map(toNotification);
  },

  async obtenerConteoNoLeidas(timeoutMs = 10000): Promise<number> {
    const response = await apiRequestWithTimeout<UnreadCountResponse>(
      '/api/notificaciones/no-leidas',
      {},
      timeoutMs
    );
    return response.noLeidas;
  },

  async obtenerRecordatorios(timeoutMs = 15000): Promise<RecordatorioCita[]> {
    const appointments = await apiRequestWithTimeout<ReminderAppointmentResponse[]>(
      '/api/recordatorios',
      {},
      timeoutMs
    );
    return appointments.map((appointment) => ({
      id: appointment.id,
      service: appointment.specialty?.name || appointment.reason || 'Cita veterinaria',
      petName: appointment.pet.name,
      vetName: appointment.veterinarian.name,
      scheduledAt: appointment.scheduledAt
    }));
  },

  async marcarComoLeida(id: string, timeoutMs = 10000): Promise<void> {
    await apiRequestWithTimeout<void>(
      `/api/notificaciones/${encodeURIComponent(id)}/leer`,
      { method: 'PATCH' },
      timeoutMs
    );
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }
  },

  async marcarTodasComoLeidas(timeoutMs = 10000): Promise<void> {
    await apiRequestWithTimeout<void>(
      '/api/notificaciones/leer-todas',
      { method: 'PATCH' },
      timeoutMs
    );
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }
  }
};
