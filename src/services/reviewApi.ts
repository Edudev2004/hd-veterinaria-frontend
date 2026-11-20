import { apiRequestWithTimeout } from './apiClient';

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export interface ReviewDTO {
  id: string;
  appointmentId?: string;
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
 * Aplica timeout acotado de 15 segundos para evitar bloqueos indefinidos.
 * El backend responde 409 si la cita ya fue valorada.
 */
export const createReview = async (
  citaId: string,
  payload: CreateReviewPayload,
  timeoutMs = 15000
): Promise<ReviewDTO> => {
  return apiRequestWithTimeout<ReviewDTO>(
    `/api/citas/${citaId}/valoracion`,
    {
      method: 'POST',
      body: {
        rating: payload.rating,
        comment: payload.comment?.trim() || null,
      },
    },
    timeoutMs
  );
};

/**
 * Consulta las valoraciones públicas de un veterinario con timeout acotado.
 */
export const getVeterinarianReviews = async (
  veterinarioId: string,
  timeoutMs = 15000
): Promise<VeterinarianReviewsDTO> => {
  return apiRequestWithTimeout<VeterinarianReviewsDTO>(
    `/api/veterinarios/${veterinarioId}/valoraciones`,
    { auth: false },
    timeoutMs
  );
};

export const reviewService = {
  createReview,
  getVeterinarianReviews,
};
