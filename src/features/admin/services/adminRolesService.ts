import { apiRequest } from '../../../services/apiClient';

export interface RoleDTO {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export const adminRolesService = {
  async listar(): Promise<RoleDTO[]> {
    return apiRequest<RoleDTO[]>('/api/admin/roles');
  },

  async obtenerPorId(id: string): Promise<RoleDTO> {
    return apiRequest<RoleDTO>(`/api/admin/roles/${encodeURIComponent(id)}`);
  },

  async crear(data: RoleRequest): Promise<RoleDTO> {
    return apiRequest<RoleDTO>('/api/admin/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async actualizar(id: string, data: RoleRequest): Promise<RoleDTO> {
    return apiRequest<RoleDTO>(`/api/admin/roles/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async eliminar(id: string): Promise<void> {
    return apiRequest<void>(`/api/admin/roles/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
