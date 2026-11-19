import { apiRequestWithTimeout } from '../../../services/apiClient';
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

export const toPaciente = (item: VetPatientResponse): PacienteVeterinario => {
  const nombreTutor = [item.owner?.firstName, item.owner?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    mascota: {
      id: item.pet.id,
      nombre: item.pet.name,
      especie: item.pet.species,
      raza: item.pet.breed ?? undefined,
      sexo: item.pet.gender
        ? item.pet.gender.toLowerCase() === 'hembra'
          ? 'hembra'
          : 'macho'
        : undefined,
      fecha_nacimiento: item.pet.birthDate ?? undefined,
      foto_url: item.pet.photoUrl ?? undefined,
      propietario_id: item.owner?.id,
      propietario_nombre: nombreTutor || undefined
    },
    totalAtenciones: item.totalAtenciones ?? 0,
    ultimaAtencion: item.ultimaAtencion
  };
};

export const getMisPacientes = async (): Promise<PacienteVeterinario[]> => {
  const response = await apiRequestWithTimeout<VetPatientResponse[]>(
    '/api/veterinarios/me/pacientes',
    {},
    15000
  );

  return (response ?? []).map(toPaciente);
};