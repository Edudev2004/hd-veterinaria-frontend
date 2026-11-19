import { apiRequest } from '@/services/apiClient';
import type {
  ReviewApiDTO,
  ValoracionVeterinario,
  VeterinarianProfileApiDTO
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

export const vetReviewsService = {
  getPerfilVeterinario
};