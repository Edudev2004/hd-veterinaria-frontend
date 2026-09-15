export interface Notificacion {
  id: string;
  usuario_id: string;
  mensaje: string;
  tipo: 'cita' | 'recordatorio' | 'sistema';
  leido: boolean;
  created_at: string;
}