export interface ValoracionVeterinario {
  id: string;
  cita_id: string;
  puntuacion: number; // 1 a 5, según el check constraint del SQL
  comentario: string;
  created_at: string;
  // Datos combinados de la cita relacionada, solo para mostrar en pantalla
  mascotaNombre: string;
  propietarioNombre: string;
}