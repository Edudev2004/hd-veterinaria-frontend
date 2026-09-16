import type {
  GuardarAtencionInput,
  RegistroAtencion
} from '../types/vetConsultation.types';

interface AtencionActiva {
  citaId: string;
  veterinarioId: string;
  iniciadaAt: string;
}

const STORAGE_ATENCIONES_KEY = 'vethd_db_atenciones_veterinarias';
const STORAGE_ATENCION_ACTIVA_KEY = 'vethd_db_atencion_activa';

const getStoredAtenciones = (): RegistroAtencion[] => {
  const data = localStorage.getItem(STORAGE_ATENCIONES_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as RegistroAtencion[];
  } catch {
    return [];
  }
};

const saveStoredAtenciones = (atenciones: RegistroAtencion[]): void => {
  localStorage.setItem(STORAGE_ATENCIONES_KEY, JSON.stringify(atenciones));
};

const getStoredAtencionActiva = (): AtencionActiva | null => {
  const data = localStorage.getItem(STORAGE_ATENCION_ACTIVA_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as AtencionActiva;
  } catch {
    return null;
  }
};

const iniciarAtencion = (
  citaId: string,
  veterinarioId: string
): AtencionActiva => {
  const atencionActiva: AtencionActiva = {
    citaId,
    veterinarioId,
    iniciadaAt: new Date().toISOString()
  };

  localStorage.setItem(
    STORAGE_ATENCION_ACTIVA_KEY,
    JSON.stringify(atencionActiva)
  );

  return atencionActiva;
};

const getAtencionActiva = (
  veterinarioId: string
): AtencionActiva | null => {
  const atencionActiva = getStoredAtencionActiva();

  if (atencionActiva?.veterinarioId !== veterinarioId) {
    return null;
  }

  return atencionActiva;
};

const limpiarAtencionActiva = (veterinarioId: string): void => {
  const atencionActiva = getStoredAtencionActiva();

  if (atencionActiva?.veterinarioId === veterinarioId) {
    localStorage.removeItem(STORAGE_ATENCION_ACTIVA_KEY);
  }
};

const getAtencionByCita = async (
  citaId: string,
  veterinarioId: string
): Promise<RegistroAtencion | null> => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  return (
    getStoredAtenciones().find(
      (atencion) =>
        atencion.citaId === citaId &&
        atencion.veterinarioId === veterinarioId
    ) ?? null
  );
};

const guardarAtencion = async (
  input: GuardarAtencionInput
): Promise<RegistroAtencion> => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const atenciones = getStoredAtenciones();
  const ahora = new Date().toISOString();

  const indiceExistente = atenciones.findIndex(
    (atencion) =>
      atencion.citaId === input.citaId &&
      atencion.veterinarioId === input.veterinarioId
  );

  const registro: RegistroAtencion = {
    id:
      indiceExistente >= 0
        ? atenciones[indiceExistente].id
        : `atencion-${Date.now()}`,
    ...input,
    createdAt:
      indiceExistente >= 0
        ? atenciones[indiceExistente].createdAt
        : ahora,
    updatedAt: ahora
  };

  if (indiceExistente >= 0) {
    atenciones[indiceExistente] = registro;
  } else {
    atenciones.push(registro);
  }

  saveStoredAtenciones(atenciones);

  return registro;
};

export const vetConsultationService = {
  iniciarAtencion,
  getAtencionActiva,
  limpiarAtencionActiva,
  getAtencionByCita,
  guardarAtencion
};