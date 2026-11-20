import { apiRequest } from '../../../services/apiClient';

export interface AdminVeterinarianDTO {
  id: string;
  userId: string;
  dni: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  photoUrl?: string;
  active: boolean;
  specialties: string[];
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface VeterinarianCreateRequest {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  photoUrl?: string;
  specialtyIds: string[];
}

export interface VeterinarianUpdateRequest {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  specialtyIds: string[];
}

export const adminVeterinarianService = {
  async listar(nombre?: string, estado?: string, page: number = 0, size: number = 100): Promise<AdminVeterinarianDTO[]> {
    const params = new URLSearchParams();
    if (nombre?.trim()) params.append('nombre', nombre.trim());
    if (estado?.trim()) params.append('estado', estado.trim());
    params.append('page', page.toString());
    params.append('size', size.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest<PageResponse<AdminVeterinarianDTO>>(`/api/admin/veterinarios${queryString}`);
    return res.content || [];
  },

  async registrar(data: VeterinarianCreateRequest): Promise<AdminVeterinarianDTO> {
    return apiRequest<AdminVeterinarianDTO>('/api/admin/veterinarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async actualizar(id: string, data: VeterinarianUpdateRequest): Promise<AdminVeterinarianDTO> {
    return apiRequest<AdminVeterinarianDTO>(`/api/admin/veterinarios/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async cambiarEstado(id: string): Promise<AdminVeterinarianDTO> {
    return apiRequest<AdminVeterinarianDTO>(`/api/admin/veterinarios/${encodeURIComponent(id)}/estado`, {
      method: 'PATCH',
    });
  },
};
