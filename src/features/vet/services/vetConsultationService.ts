import type {
  GuardarAtencionInput,
  RegistroAtencion
} from '../types/vetConsultation.types';

const STORAGE_ATENCIONES_KEY = 'vethd_db_atenciones_veterinarias';

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
  getAtencionByCita,
  guardarAtencion
};