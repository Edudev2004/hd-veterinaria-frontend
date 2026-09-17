import type {
  GuardarAtencionInput,
  RegistroAtencion
} from '../types/vetConsultation.types';

interface AtencionEnCurso {
  citaId: string;
  veterinarioId: string;
  iniciadaAt: string;
}

const STORAGE_ATENCIONES_KEY = 'vethd_db_atenciones_veterinarias';
const STORAGE_ATENCIONES_EN_CURSO_KEY =
  'vethd_db_atenciones_en_curso';
const STORAGE_ATENCION_ACTIVA_ANTERIOR_KEY =
  'vethd_db_atencion_activa';

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

  return atenciones.at(-1) ?? null;
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
  getAtencionesEnCurso,
  getAtencionActiva,
  limpiarAtencionActiva,
  getAtencionByCita,
  guardarAtencion
};