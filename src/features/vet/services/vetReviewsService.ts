
import valoracionesSeed from '../mocks/valoracionesVeterinario.json';
import type { ValoracionVeterinario } from '../types/valoracion.types';

const STORAGE_VALORACIONES_KEY = 'vethd_db_valoraciones_veterinario';

const getStoredValoraciones = (): ValoracionVeterinario[] => {
  const data = localStorage.getItem(STORAGE_VALORACIONES_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_VALORACIONES_KEY, JSON.stringify(valoracionesSeed));
    return valoracionesSeed as ValoracionVeterinario[];
  }
  try {
    return JSON.parse(data) as ValoracionVeterinario[];
  } catch {
    return valoracionesSeed as ValoracionVeterinario[];
  }
};

export const getMisValoraciones = async (): Promise<ValoracionVeterinario[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return getStoredValoraciones();
};

export const getPromedioValoraciones = async (): Promise<number> => {
  const valoraciones = getStoredValoraciones();
  if (valoraciones.length === 0) return 0;
  const suma = valoraciones.reduce((acc, v) => acc + v.puntuacion, 0);
  return Number((suma / valoraciones.length).toFixed(1));
};

export const vetReviewsService = {
  getMisValoraciones,
  getPromedioValoraciones
};