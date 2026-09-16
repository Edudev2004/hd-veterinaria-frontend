export interface ValoracionVeterinario {
  id: string;
  cita_id: string;
  puntuacion: number;
  comentario: string;
  created_at: string;
  mascotaNombre: string;
  mascotaFotoUrl?: string;
  propietarioNombre: string;
}