import { apiRequest } from '@/services/apiClient';
import type {
  ResumenValoraciones,
  ReviewApiDTO,
  ValoracionVeterinario,
  VeterinarianProfileApiDTO,
  VeterinarianReviewsApiDTO
} from '../types/valoracion.types';

const toValoracion = (dto: ReviewApiDTO): ValoracionVeterinario => ({
  id: dto.id,
  cita_id: dto.appointmentId ?? '',
  puntuacion: dto.rating,
  comentario: dto.comment ?? '',
  created_at: dto.createdAt,
  mascotaNombre: dto.petName ?? 'Paciente',
  mascotaFotoUrl: dto.petPhotoUrl ?? undefined,
  propietarioNombre: dto.ownerName ?? 'Propietario'
});

/**
 * Obtiene el veterinario autenticado (GET /api/veterinarios/me).
 */
export const getPerfilVeterinario =
  async (): Promise<VeterinarianProfileApiDTO> => {
    return apiRequest<VeterinarianProfileApiDTO>('/api/veterinarios/me');
  };

/**
 * Valoraciones y promedio del veterinario autenticado
 * (GET /api/veterinarios/{id}/valoraciones).
 */
export const getMisValoraciones = async (): Promise<ResumenValoraciones> => {
  const perfil = await getPerfilVeterinario();

  const respuesta = await apiRequest<VeterinarianReviewsApiDTO>(
    `/api/veterinarios/${perfil.id}/valoraciones`
  );

  const valoraciones = (respuesta.valoraciones ?? []).map(toValoracion);

  return {
    promedio: respuesta.promedio ?? 0,
    total: respuesta.totalValoraciones ?? valoraciones.length,
    valoraciones
  };
};

export const vetReviewsService = {
  getPerfilVeterinario,
  getMisValoraciones
};