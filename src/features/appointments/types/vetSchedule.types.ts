export type EstadoCita = 'pendiente' | 'atendida' | 'no_atendida' | 'cancelada';

export interface MascotaResumen {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  descripcion: string;
  fotoUrl?: string;
}

export interface PropietarioResumen {
  id: string;
  nombre: string;
  telefono: string;
  fotoUrl?: string;
}

export interface CitaAgenda {
  id: string;
  mascota_id: string;
  veterinario_id: string;
  fecha_hora: string;
  estado: EstadoCita;
  motivo: string;
  created_at: string;
  mascota: MascotaResumen;
  propietario: PropietarioResumen;
}

/* ---------- Respuestas del backend (AppointmentResponse y anidados) ---------- */

export interface PetApiDTO {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birthDate: string | null;
  observations: string | null;
  photoUrl: string | null;
  active: boolean;
  createdAt: string | null;
}

export interface OwnerApiDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  photoUrl: string | null;
}

export interface DiagnosisApiDTO {
  id: string;
  diagnosis: string;
  details: string | null;
  treatment: string | null;
  notes: string | null;
  nextSuggestedAppointment: string | null;
  createdAt: string;
}

export interface AppointmentApiDTO {
  id: string;
  pet: PetApiDTO;
  owner: OwnerApiDTO | null;
  veterinarian: { id: string } | null;
  scheduledAt: string;
  status: string;
  reason: string | null;
  cancellationReason: string | null;
  createdAt: string | null;
  diagnosis: DiagnosisApiDTO | null;
}