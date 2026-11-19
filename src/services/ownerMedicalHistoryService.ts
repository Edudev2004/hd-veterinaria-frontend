import { apiRequest } from './apiClient';
import {
  EntradaHistorialClinico,
  HistorialMascotaResumen,
  MascotaExpediente
} from '../types/historial.types';

interface PetResponse {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birthDate: string | null;
  photoUrl: string | null;
}

interface VeterinarianResponse {
  id: string;
  name: string;
  specialtyName: string | null;
  email: string | null;
}

interface MedicalHistoryEntryResponse {
  id: string;
  appointmentId: string;
  petId: string;
  attentionDate: string;
  veterinarian: VeterinarianResponse;
  consultationReason: string | null;
  diagnosis: string;
  details: string | null;
  treatment: string;
  notes: string | null;
  createdAt: string;
}

interface MedicalHistoryResponse {
  pet: PetResponse;
  totalAtenciones?: number | null;
  totalEntries?: number | null;
  ultimaAtencion?: string | null;
  lastAttentionDate?: string | null;
  primeraAtencion?: string | null;
  firstAttentionDate?: string | null;
  entradas?: MedicalHistoryEntryResponse[] | null;
  entries?: MedicalHistoryEntryResponse[] | null;
}

const toMascotaExpediente = (pet: PetResponse): MascotaExpediente => ({
  id: pet.id,
  nombre: pet.name,
  especie: pet.species,
  raza: pet.breed ?? undefined,
  sexo: pet.gender
    ? pet.gender.toLowerCase() === 'hembra'
      ? 'hembra'
      : 'macho'
    : undefined,
  fecha_nacimiento: pet.birthDate ?? undefined,
  foto_url: pet.photoUrl ?? undefined
});

const toEntradaHistorial = (
  entry: MedicalHistoryEntryResponse,
  mascota: MascotaExpediente
): EntradaHistorialClinico => ({
  id: entry.id,
  cita_id: entry.appointmentId,
  mascota_id: entry.petId,
  fecha_atencion: entry.attentionDate,
  veterinario: {
    id: entry.veterinarian.id,
    nombre: entry.veterinarian.name,
    especialidad: entry.veterinarian.specialtyName ?? 'Medicina General',
    email: entry.veterinarian.email ?? undefined
  },
  mascota,
  motivo_consulta: entry.consultationReason,
  diagnostico: entry.diagnosis,
  tratamiento: entry.treatment,
  observaciones: entry.notes ?? '',
  datos: entry.details,
  created_at: entry.createdAt
});

export const getHistorialClinicoPropietario = async (
  mascotaId: string
): Promise<HistorialMascotaResumen> => {
  if (!mascotaId) {
    throw new Error('No se recibió el identificador de la mascota.');
  }

  const response = await apiRequest<MedicalHistoryResponse>(
    `/api/mascotas/${encodeURIComponent(mascotaId)}/historial`
  );
  const mascota = toMascotaExpediente(response.pet);
  const entries = response.entries ?? response.entradas ?? [];
  const entradas = entries.map((entry) => toEntradaHistorial(entry, mascota));

  return {
    mascota,
    totalAtenciones: response.totalAtenciones ?? response.totalEntries ?? entradas.length,
    ultimaAtencion:
      response.ultimaAtencion ?? response.lastAttentionDate ?? entradas[0]?.fecha_atencion ?? null,
    primeraAtencion:
      response.primeraAtencion ??
      response.firstAttentionDate ??
      entradas[entradas.length - 1]?.fecha_atencion ??
      null,
    entradas
  };
};
