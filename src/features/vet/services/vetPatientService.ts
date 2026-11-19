import type { MascotaExpediente } from '../../../types/historial.types';

export interface PetResponse {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birthDate: string | null;
  photoUrl: string | null;
}

export interface OwnerResponse {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface VetPatientResponse {
  pet: PetResponse;
  owner: OwnerResponse | null;
  totalAtenciones: number | null;
  ultimaAtencion: string | null;
}

export interface PacienteVeterinario {
  mascota: MascotaExpediente;
  totalAtenciones: number;
  ultimaAtencion?: string | null;
}