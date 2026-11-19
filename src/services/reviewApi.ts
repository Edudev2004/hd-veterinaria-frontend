import { apiRequest } from './apiClient';

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export interface ReviewDTO {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | null;
}

export interface VeterinarianReviewsDTO {
  promedio: number | null;
  totalValoraciones: number | null;
  valoraciones: ReviewDTO[] | null;
}

/**
 * Registra la valoración de una cita ATENDIDA del propietario autenticado.
 * El backend responde 409 si la cita ya fue valorada.
 */
export const createReview = async (
  citaId: string,
  payload: CreateReviewPayload
): Promise<ReviewDTO> => {
  return apiRequest<ReviewDTO>(`/api/citas/${citaId}/valoracion`, {
    method: 'POST',
    body: {
      rating: payload.rating,
      comment: payload.comment?.trim() || null,
    },
  });
};

export const getVeterinarianReviews = async (
  veterinarioId: string
): Promise<VeterinarianReviewsDTO> => {
  return apiRequest<VeterinarianReviewsDTO>(
    `/api/veterinarios/${veterinarioId}/valoraciones`,
    { auth: false }
  );
};

export const reviewService = {
  createReview,
  getVeterinarianReviews,
};
