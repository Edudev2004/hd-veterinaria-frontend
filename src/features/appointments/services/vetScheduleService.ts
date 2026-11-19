import citasSeed from '../mocks/citasVeterinario.json';
import { ApiError, apiRequest } from '@/services/apiClient';
import type {
  AppointmentApiDTO,
  CitaAgenda,
  EstadoCita
} from '../types/vetSchedule.types';

const ESTADOS_API: Record<string, EstadoCita> = {
  PENDIENTE: 'pendiente',
  ATENDIDA: 'atendida',
  NO_ATENDIDA: 'no_atendida',
  CANCELADA: 'cancelada'
};

const normalizarEstado = (status: string): EstadoCita => {
  return ESTADOS_API[(status ?? '').toUpperCase()] ?? 'pendiente';
};

const calcularEdad = (birthDate: string | null): string => {
  if (!birthDate) {
    return 'Edad no registrada';
  }

  const nacimiento = new Date(`${birthDate}T00:00:00`);

  if (Number.isNaN(nacimiento.getTime())) {
    return 'Edad no registrada';
  }

  const hoy = new Date();
  let meses =
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
    (hoy.getMonth() - nacimiento.getMonth());

  if (hoy.getDate() < nacimiento.getDate()) {
    meses -= 1;
  }

  meses = Math.max(meses, 0);

  const anios = Math.floor(meses / 12);

  if (anios >= 1) {
    return `${anios} ${anios === 1 ? 'año' : 'años'}`;
  }

  return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
};

const toCitaAgenda = (dto: AppointmentApiDTO): CitaAgenda => {
  const owner = dto.owner;

  return {
    id: dto.id,
    mascota_id: dto.pet.id,
    veterinario_id: dto.veterinarian?.id ?? '',
    fecha_hora: dto.scheduledAt,
    estado: normalizarEstado(dto.status),
    motivo: dto.reason ?? '',
    created_at: dto.createdAt ?? dto.scheduledAt,
    mascota: {
      id: dto.pet.id,
      nombre: dto.pet.name,
      especie: dto.pet.species,
      raza: dto.pet.breed ?? 'Sin raza registrada',
      edad: calcularEdad(dto.pet.birthDate),
      descripcion:
        dto.pet.observations?.trim() || 'Sin observaciones registradas.',
      fotoUrl: dto.pet.photoUrl ?? undefined
    },
    propietario: {
      id: owner?.id ?? '',
      nombre: owner
        ? `${owner.firstName} ${owner.lastName}`.trim()
        : 'Propietario no disponible',
      telefono: owner?.phone ?? 'Sin teléfono',
      fotoUrl: owner?.photoUrl ?? undefined
    },
    motivo_cancelacion: dto.cancellationReason ?? undefined,
    diagnostico: dto.diagnosis ?? null
  };
};

const STORAGE_CITAS_KEY = 'vethd_db_citas_veterinario';

const getStoredCitas = (): CitaAgenda[] => {
  const data = localStorage.getItem(STORAGE_CITAS_KEY);

  if (!data) {
    localStorage.setItem(STORAGE_CITAS_KEY, JSON.stringify(citasSeed));
    return citasSeed as CitaAgenda[];
  }

  try {
    return JSON.parse(data) as CitaAgenda[];
  } catch {
    return citasSeed as CitaAgenda[];
  }
};

const saveStoredCitas = (citas: CitaAgenda[]): void => {
  localStorage.setItem(STORAGE_CITAS_KEY, JSON.stringify(citas));
};

/**
 * Agenda del veterinario autenticado para una fecha (YYYY-MM-DD).
 */
export const getAgendaDiaria = async (fecha: string): Promise<CitaAgenda[]> => {
  const citas = await apiRequest<AppointmentApiDTO[]>(
    `/api/veterinarios/me/agenda?fecha=${encodeURIComponent(fecha)}`
  );

  return citas.map(toCitaAgenda);
};

/**
 * Detalle de una cita (incluye el diagnóstico si ya fue registrado).
 */
export const getCitaById = async (
  citaId: string
): Promise<CitaAgenda | null> => {
  try {
    const cita = await apiRequest<AppointmentApiDTO>(`/api/citas/${citaId}`);

    return toCitaAgenda(cita);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const marcarCitaComoAtendida = async (
  citaId: string
): Promise<CitaAgenda> => {
  const cita = await apiRequest<AppointmentApiDTO>(
    `/api/citas/${citaId}/atendida`,
    { method: 'PATCH' }
  );

  return toCitaAgenda(cita);
};

export const marcarCitaComoNoAtendida = async (
  citaId: string,
  veterinarioId: string
): Promise<CitaAgenda | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const citas = getStoredCitas();
  const indice = citas.findIndex(
    (cita) =>
      cita.id === citaId && cita.veterinario_id === veterinarioId
  );

  if (indice < 0) {
    return null;
  }

  const citaActualizada: CitaAgenda = {
    ...citas[indice],
    estado: 'no_atendida'
  };

  citas[indice] = citaActualizada;
  saveStoredCitas(citas);

  return citaActualizada;
};

export const vetScheduleService = {
  getAgendaDiaria,
  getCitaById,
  marcarCitaComoAtendida,
  marcarCitaComoNoAtendida
};