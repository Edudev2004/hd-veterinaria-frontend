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

// US-20: Visualizar agenda diaria del veterinario autenticado
export const getAgendaDiaria = async (veterinarioId: string): Promise<CitaAgenda[]> => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const citas = getStoredCitas();
  return citas.filter((c) => c.veterinario_id === veterinarioId);
};

export const vetScheduleService = {
  getAgendaDiaria
};