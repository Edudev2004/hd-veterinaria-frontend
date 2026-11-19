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

export interface ResumenValoraciones {
  promedio: number;
  total: number;
  valoraciones: ValoracionVeterinario[];
}

/* ---------- Respuestas del backend ---------- */

export interface VeterinarianProfileApiDTO {
  id: string;
  name: string;
  email: string | null;
  photoUrl: string | null;
}

export interface ReviewApiDTO {
  id: string;
  appointmentId: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
  petName: string | null;
  petPhotoUrl: string | null;
  ownerName: string | null;
}

export interface VeterinarianReviewsApiDTO {
  promedio: number | null;
  totalValoraciones: number | null;
  valoraciones: ReviewApiDTO[];
}