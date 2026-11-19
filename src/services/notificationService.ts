import { apiRequest } from './apiClient';
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
    mensaje: notification.message,
    tipo,
    leido: notification.read,
    created_at: notification.createdAt
  };
};

export const notificationService = {
  async obtenerNotificaciones(): Promise<Notificacion[]> {
    const notifications = await apiRequest<NotificationResponse[]>('/api/notificaciones');
    return notifications.map(toNotification);
  },

  async obtenerConteoNoLeidas(): Promise<number> {
    const response = await apiRequest<UnreadCountResponse>('/api/notificaciones/no-leidas');
    return response.noLeidas;
  },

  async obtenerRecordatorios(): Promise<RecordatorioCita[]> {
    const appointments = await apiRequest<ReminderAppointmentResponse[]>('/api/recordatorios');
    return appointments.map((appointment) => ({
      id: appointment.id,
      service: appointment.specialty?.name || appointment.reason || 'Cita veterinaria',
      petName: appointment.pet.name,
      vetName: appointment.veterinarian.name,
      scheduledAt: appointment.scheduledAt
    }));
  },

  async marcarComoLeida(id: string): Promise<void> {
    await apiRequest<void>(`/api/notificaciones/${encodeURIComponent(id)}/leer`, {
      method: 'PATCH'
    });
  },

  async marcarTodasComoLeidas(): Promise<void> {
    await apiRequest<void>('/api/notificaciones/leer-todas', { method: 'PATCH' });
  }
};
