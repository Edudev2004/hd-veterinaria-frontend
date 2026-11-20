export interface Notificacion {
  id: string;
  titulo?: string;
  mensaje: string;
  tipo: 'cita' | 'recordatorio' | 'sistema';
  leido: boolean;
  created_at: string;
}