import { apiRequest } from '@/services/apiClient';
import type { DiagnosisApiDTO } from '../../appointments/types/vetSchedule.types';
import type {
  GuardarAtencionInput,
  RegistroAtencion
} from '../types/vetConsultation.types';

interface AtencionEnCurso {
  citaId: string;
  veterinarioId: string;
  iniciadaAt: string;
}

const STORAGE_ATENCIONES_EN_CURSO_KEY =
  'vethd_db_atenciones_en_curso';
const STORAGE_ATENCION_ACTIVA_ANTERIOR_KEY =
  'vethd_db_atencion_activa';

const getStoredAtencionesEnCurso = (): AtencionEnCurso[] => {
  const data = localStorage.getItem(STORAGE_ATENCIONES_EN_CURSO_KEY);

  if (data) {
    try {
      return JSON.parse(data) as AtencionEnCurso[];
    } catch {
      return [];
    }
  }

  const atencionAnterior = localStorage.getItem(
    STORAGE_ATENCION_ACTIVA_ANTERIOR_KEY
  );

  if (!atencionAnterior) {
    return [];
  }

  try {
    const atencionMigrada = JSON.parse(
      atencionAnterior
    ) as AtencionEnCurso[];

    const atenciones = Array.isArray(atencionMigrada)
      ? atencionMigrada
      : [atencionMigrada];

    localStorage.setItem(
      STORAGE_ATENCIONES_EN_CURSO_KEY,
      JSON.stringify(atenciones)
    );

    return atenciones;
  } catch {
    return [];
  }
};

const saveStoredAtencionesEnCurso = (
  atenciones: AtencionEnCurso[]
): void => {
  localStorage.setItem(
    STORAGE_ATENCIONES_EN_CURSO_KEY,
    JSON.stringify(atenciones)
  );
};

const iniciarAtencion = (
  citaId: string,
  veterinarioId: string
): AtencionEnCurso => {
  const atenciones = getStoredAtencionesEnCurso();

  const indiceExistente = atenciones.findIndex(
    (atencion) =>
      atencion.citaId === citaId &&
      atencion.veterinarioId === veterinarioId
  );

  const atencionEnCurso: AtencionEnCurso = {
    citaId,
    veterinarioId,
    iniciadaAt:
      indiceExistente >= 0
        ? atenciones[indiceExistente].iniciadaAt
        : new Date().toISOString()
  };

  if (indiceExistente >= 0) {
    atenciones[indiceExistente] = atencionEnCurso;
  } else {
    atenciones.push(atencionEnCurso);
  }

  saveStoredAtencionesEnCurso(atenciones);

  return atencionEnCurso;
};

const getAtencionesEnCurso = (
  veterinarioId: string
): AtencionEnCurso[] => {
  return getStoredAtencionesEnCurso().filter(
    (atencion) => atencion.veterinarioId === veterinarioId
  );
};

const getAtencionActiva = (
  veterinarioId: string
): AtencionEnCurso | null => {
  const atenciones = getAtencionesEnCurso(veterinarioId);

  return atenciones[atenciones.length - 1] ?? null;
};

const limpiarAtencionActiva = (
  veterinarioId: string,
  citaId?: string
): void => {
  const atencionesActualizadas = getStoredAtencionesEnCurso().filter(
    (atencion) => {
      if (atencion.veterinarioId !== veterinarioId) {
        return true;
      }

      return citaId ? atencion.citaId !== citaId : false;
    }
  );

  saveStoredAtencionesEnCurso(atencionesActualizadas);
};

const toRegistroAtencion = (
  citaId: string,
  dto: DiagnosisApiDTO
): RegistroAtencion => ({
  id: dto.id,
  citaId,
  diagnostico: dto.diagnosis,
  tratamiento: dto.treatment ?? '',
  notas: dto.notes ?? '',
  createdAt: dto.createdAt
});

/**
 * Registra el diagnóstico de una cita ya ATENDIDA (POST /api/citas/{id}/consulta).
 */
const registrarConsulta = async (
  input: GuardarAtencionInput
): Promise<RegistroAtencion> => {
  const notas = input.notas.trim();

  const diagnostico = await apiRequest<DiagnosisApiDTO>(
    `/api/citas/${input.citaId}/consulta`,
    {
      method: 'POST',
      body: {
        diagnosis: input.diagnostico.trim(),
        treatment: input.tratamiento.trim(),
        notes: notas || undefined
      }
    }
  );

  return toRegistroAtencion(input.citaId, diagnostico);
};

export const vetConsultationService = {
  iniciarAtencion,
  getAtencionesEnCurso,
  getAtencionActiva,
  limpiarAtencionActiva,
  registrarConsulta
};