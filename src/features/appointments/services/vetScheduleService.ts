import citasSeed from '../mocks/citasVeterinario.json';
import type { CitaAgenda } from '../types/vetSchedule.types';

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

export const getAgendaDiaria = async (
  veterinarioId: string
): Promise<CitaAgenda[]> => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return getStoredCitas().filter(
    (cita) => cita.veterinario_id === veterinarioId
  );
};

export const getCitaById = async (
  citaId: string,
  veterinarioId: string
): Promise<CitaAgenda | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return (
    getStoredCitas().find(
      (cita) =>
        cita.id === citaId && cita.veterinario_id === veterinarioId
    ) ?? null
  );
};

export const marcarCitaComoAtendida = async (
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
    estado: 'atendida'
  };

  citas[indice] = citaActualizada;
  saveStoredCitas(citas);

  return citaActualizada;
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