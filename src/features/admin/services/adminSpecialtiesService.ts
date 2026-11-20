import { apiRequest } from '../../../services/apiClient';

export interface SpecialtyDTO {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface SpecialtyRequest {
  name: string;
  description: string;
  active?: boolean;
}

export const adminSpecialtiesService = {
  async listarTodas(): Promise<SpecialtyDTO[]> {
    return apiRequest<SpecialtyDTO[]>('/api/admin/especialidades');
  },

  async crear(data: SpecialtyRequest): Promise<SpecialtyDTO> {
    return apiRequest<SpecialtyDTO>('/api/admin/especialidades', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        description: data.description || '',
        active: data.active ?? true,
      }),
    });
  },

  async actualizar(id: string, data: SpecialtyRequest): Promise<SpecialtyDTO> {
    return apiRequest<SpecialtyDTO>(`/api/admin/especialidades/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        description: data.description || '',
        active: data.active ?? true,
      }),
    });
  },

  async cambiarEstado(id: string, active: boolean): Promise<SpecialtyDTO> {
    return apiRequest<SpecialtyDTO>(`/api/admin/especialidades/${encodeURIComponent(id)}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  },
};
