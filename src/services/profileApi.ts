import { apiRequest } from './apiClient';

export interface Perfil {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fotoUrl?: string;
}

export interface UpdatePerfilPayload {
  nombres: string;
  apellidos: string;
  telefono: string;
  fotoUrl?: string;
}

interface OwnerDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  photoUrl: string | null;
}

const toPerfil = (owner: OwnerDTO): Perfil => ({
  id: owner.id,
  nombres: owner.firstName,
  apellidos: owner.lastName,
  email: owner.email,
  telefono: owner.phone ?? undefined,
  direccion: owner.address ?? undefined,
  fotoUrl: owner.photoUrl ?? undefined,
});

export const getProfile = async (): Promise<Perfil> => {
  const owner = await apiRequest<OwnerDTO>('/api/propietarios/me');
  return toPerfil(owner);
};

export const updateProfile = async (payload: UpdatePerfilPayload): Promise<Perfil> => {
  const owner = await apiRequest<OwnerDTO>('/api/propietarios/me', {
    method: 'PUT',
    body: {
      firstName: payload.nombres.trim(),
      lastName: payload.apellidos.trim(),
      phone: payload.telefono.trim(),
      photoUrl: payload.fotoUrl?.trim() ?? '',
    },
  });
  return toPerfil(owner);
};
