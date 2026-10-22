import { ApiError, apiRequest } from './apiClient';
import {
  CitaDetallada,
  ModificarCitaPayload,
  CancelarCitaPayload,
  CancelarCitaResult,
  MotivoCancelacionOpcion,
  VeterinarioDetallado,
  FranjaHorariaDisponible,
  MascotaCita,
  EstadoCita
} from '../types/cita.types';

export interface EspecialidadOption {
  id: string;
  name: string;
  description: string;
}

export interface CreateCitaPayload {
  petId: string;
  veterinarianId: string;
  specialtyId: string;
  date: string; // YYYY-MM-DD
  hour: string; // HH:mm
  reason: string;
}

interface PetDTO {
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

interface VeterinarianDTO {
  id: string;
  name: string;
  specialtyName: string | null;
  email: string | null;
  photoUrl: string | null;
  averageRating: number | null;
}

interface SpecialtyDTO {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
}

interface AppointmentDTO {
  id: string;
  pet: PetDTO;
  veterinarian: VeterinarianDTO;
  specialty: SpecialtyDTO | null;
  scheduledAt: string;
  status: string;
  reason: string | null;
  cancellationReason: string | null;
  createdAt: string | null;
  diagnosis?: unknown;
}

interface AvailabilitySlotDTO {
  hour: string;
  available: boolean;
}

/**
 * Catálogo de motivos predefinidos comunes para la cancelación (US-16)
 */
export const MOTIVOS_CANCELACION_PRESET: MotivoCancelacionOpcion[] = [
  {
    id: 'emergencia_personal',
    titulo: 'Emergencia personal o familiar',
    descripcion: 'Surgió un imprevisto y no podré asistir a la hora pautada.'
  },
  {
    id: 'mejoria_mascota',
    titulo: 'Mejoría notable en la mascota',
    descripcion: 'La mascota ya no presenta síntomas y no requiere atención inmediata.'
  },
  {
    id: 'imposibilidad_traslado',
    titulo: 'Problemas de transporte o traslado',
    descripcion: 'Dificultad logística para llevar a la mascota a la veterinaria.'
  },
  {
    id: 'cambio_horario_incompatible',
    titulo: 'Horario incompatible',
    descripcion: 'Deseo cancelar para agendar en otra fecha u horario disponible.'
  },
  {
    id: 'error_agendamiento',
    titulo: 'Error involuntario al agendar',
    descripcion: 'Se eligió una mascota, veterinario o fecha equivocada.'
  },
  {
    id: 'otro',
    titulo: 'Otro motivo particular',
    descripcion: 'Se detallará la razón específica en el formulario.'
  }
];

/**
 * Normaliza los estados devueltos por el backend (PENDIENTE, CONFIRMADA, ...)
 * al tipo EstadoCita usado por la UI.
 */
export const normalizarEstado = (status?: string): EstadoCita => {
  if (!status) return 'pendiente';
  const normalizado = status.toLowerCase().trim();
  if (normalizado === 'cancelada') return 'cancelada';
  if (normalizado === 'confirmada') return 'confirmada';
  if (normalizado === 'atendida') return 'atendida';
  if (normalizado === 'no_atendida') return 'no_atendida';
  return 'pendiente';
};

/**
 * Extrae y desglosa con precisión el motivo original y la justificación de cancelación (US-18)
 * Admite lectura de campos directos y parseo de cadenas compuestas heredadas.
 */
export const extraerMotivosCita = (
  motivoRaw?: string | null,
  estado?: EstadoCita,
  motivoOriginalDirect?: string,
  motivoCancelacionDirect?: string
): { motivoOriginal: string | null; motivoCancelacion: string | null } => {
  const estadoNormalizado = normalizarEstado(estado);
  const raw = motivoRaw ? motivoRaw.trim() : '';

  if (estadoNormalizado !== 'cancelada') {
    return {
      motivoOriginal: motivoOriginalDirect || (raw.length > 0 ? raw : null),
      motivoCancelacion: null
    };
  }

  if (motivoCancelacionDirect || motivoOriginalDirect) {
    return {
      motivoOriginal: motivoOriginalDirect || null,
      motivoCancelacion: motivoCancelacionDirect || (raw.length > 0 ? raw : null)
    };
  }

  const matchCompuesto = raw.match(/^\[Cancelada:\s*(.*?)(?:\]\s*\|\s*Motivo\s*(?:inicial|original):\s*(.*)|\]\s*$)/i);
  if (matchCompuesto) {
    const cancelacion = matchCompuesto[1] ? matchCompuesto[1].trim() : null;
    const original = matchCompuesto[2] ? matchCompuesto[2].trim() : null;
    return {
      motivoOriginal: original && original.length > 0 ? original : null,
      motivoCancelacion: cancelacion && cancelacion.length > 0 ? cancelacion : raw
    };
  }

  if (raw.startsWith('[Cancelada:')) {
    const sinPrefijo = raw.replace(/^\[Cancelada:\s*/i, '').replace(/\]$/, '').trim();
    return {
      motivoOriginal: null,
      motivoCancelacion: sinPrefijo
    };
  }

  return {
    motivoOriginal: null,
    motivoCancelacion: raw.length > 0 ? raw : 'Cancelación registrada sin justificación adicional'
  };
};

const toMascota = (pet: PetDTO): MascotaCita => ({
  id: pet.id,
  propietario_id: '',
  nombre: pet.name,
  especie: pet.species,
  raza: pet.breed ?? undefined,
  foto_url: pet.photoUrl ?? undefined
});

const toVeterinario = (
  vet: VeterinarianDTO,
  especialidadId = ''
): VeterinarioDetallado => ({
  id: vet.id,
  usuario_id: '',
  especialidad_id: especialidadId,
  activo: true,
  nombre: vet.name,
  email: vet.email ?? '',
  especialidad_nombre: vet.specialtyName ?? '',
  average_rating: vet.averageRating ?? 0
});

const toCitaDetallada = (dto: AppointmentDTO): CitaDetallada => {
  const estado = normalizarEstado(dto.status);
  const especialidadId = dto.specialty?.id ?? '';

  return {
    id: dto.id,
    mascota_id: dto.pet.id,
    veterinario_id: dto.veterinarian.id,
    fecha_hora: dto.scheduledAt,
    estado,
    motivo: dto.reason,
    created_at: dto.createdAt ?? new Date().toISOString(),
    mascota: toMascota(dto.pet),
    veterinario: toVeterinario(dto.veterinarian, especialidadId),
    motivo_original: dto.reason,
    motivo_cancelacion: dto.cancellationReason
  };
};

/**
 * Divide una fecha/hora local (YYYY-MM-DDTHH:mm) sin aplicar conversiones de zona horaria.
 */
export const splitLocalDateTime = (value: string): { date: string; hour: string } => {
  const match = value.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/);
  if (match) {
    return { date: match[1], hour: `${match[2]}:${match[3]}` };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('La fecha y hora seleccionadas no son válidas.');
  }

  const date = [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, '0'),
    String(parsed.getDate()).padStart(2, '0')
  ].join('-');
  const hour = [
    String(parsed.getHours()).padStart(2, '0'),
    String(parsed.getMinutes()).padStart(2, '0')
  ].join(':');

  return { date, hour };
};

/**
 * Obtiene las especialidades activas desde el backend.
 */
export const getEspecialidades = async (): Promise<EspecialidadOption[]> => {
  const especialidades = await apiRequest<SpecialtyDTO[]>('/api/especialidades', { auth: false });

  return especialidades.map((especialidad) => ({
    id: especialidad.id,
    name: especialidad.name,
    description: especialidad.description ?? 'Atención veterinaria especializada'
  }));
};

/**
 * Obtiene el listado de veterinarios activos, opcionalmente filtrado por especialidad.
 */
export const getVeterinarios = async (
  especialidadId?: string
): Promise<VeterinarioDetallado[]> => {
  const query = especialidadId
    ? `?especialidadId=${encodeURIComponent(especialidadId)}`
    : '';
  const veterinarios = await apiRequest<VeterinarianDTO[]>(
    `/api/veterinarios${query}`,
    { auth: false }
  );

  return veterinarios.map((veterinario) => toVeterinario(veterinario, especialidadId ?? ''));
};

/**
 * Obtiene todas las citas del usuario autenticado.
 */
export const getCitas = async (): Promise<CitaDetallada[]> => {
  const citas = await apiRequest<AppointmentDTO[]>('/api/citas');

  return citas
    .map(toCitaDetallada)
    .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
};

/**
 * Obtiene una cita específica por su identificador.
 */
export const getCitaById = async (id: string): Promise<CitaDetallada | null> => {
  try {
    const cita = await apiRequest<AppointmentDTO>(`/api/citas/${id}`);
    return toCitaDetallada(cita);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Obtiene las franjas horarias disponibles para una fecha y veterinario específicos.
 */
export const getHorariosDisponibles = async (
  veterinarioId: string,
  fecha: string
): Promise<FranjaHorariaDisponible[]> => {
  const franjas = await apiRequest<AvailabilitySlotDTO[]>(
    `/api/veterinarios/${veterinarioId}/disponibilidad?fecha=${encodeURIComponent(fecha)}`,
    { auth: false }
  );

  return franjas.map((franja) => ({
    hora: franja.hour,
    disponible: franja.available
  }));
};

/**
 * Crea una cita real para la mascota del usuario autenticado.
 */
export const createCita = async (payload: CreateCitaPayload): Promise<CitaDetallada> => {
  const cita = await apiRequest<AppointmentDTO>('/api/citas', {
    method: 'POST',
    body: {
      petId: payload.petId,
      veterinarianId: payload.veterinarianId,
      specialtyId: payload.specialtyId,
      date: payload.date,
      hour: payload.hour,
      reason: payload.reason.trim()
    }
  });

  return toCitaDetallada(cita);
};

/**
 * Reprograma una cita. Solo permite cambiar fecha, hora y veterinario.
 * El motivo original se conserva y no se envía al backend.
 */
export const modificarCita = async (payload: ModificarCitaPayload): Promise<CitaDetallada> => {
  const { date, hour } = splitLocalDateTime(payload.fecha_hora);

  const cita = await apiRequest<AppointmentDTO>(`/api/citas/${payload.id}/reprogramar`, {
    method: 'PATCH',
    body: {
      newDate: date,
      newHour: hour,
      newVeterinarianId: payload.veterinario_id || undefined
    }
  });

  return toCitaDetallada(cita);
};

/**
 * Cancela una cita pendiente conservando su registro histórico.
 */
export const cancelarCita = async (payload: CancelarCitaPayload): Promise<CancelarCitaResult> => {
  const motivoLimpio = (payload.motivo_cancelacion || '').trim();
  if (motivoLimpio.length < 5) {
    throw new Error('Debes indicar un motivo de cancelación con al menos 5 caracteres.');
  }

  const cita = await apiRequest<AppointmentDTO>(`/api/citas/${payload.id}/cancelar`, {
    method: 'PATCH',
    body: { cancellationReason: motivoLimpio }
  });

  const citaDetallada = toCitaDetallada(cita);

  return {
    cita: citaDetallada,
    mensaje: `La cita para "${citaDetallada.mascota.nombre}" ha sido cancelada exitosamente.`,
    fecha_cancelacion: new Date().toISOString()
  };
};

export const citaService = {
  getCitas,
  getCitaById,
  getEspecialidades,
  getVeterinarios,
  getHorariosDisponibles,
  createCita,
  modificarCita,
  cancelarCita,
  extraerMotivosCita,
  MOTIVOS_CANCELACION_PRESET
};
