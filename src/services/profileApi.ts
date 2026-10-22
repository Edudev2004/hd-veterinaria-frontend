import { apiRequest } from './apiClient';

export interface Perfil {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fotoUrl?: string;
}

export interface UpdatePerfilPayload {
  nombre: string;
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
  nombre: `${owner.firstName} ${owner.lastName}`.trim(),
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
  const [firstName, ...rest] = payload.nombre.trim().split(/\s+/);
  const owner = await apiRequest<OwnerDTO>('/api/propietarios/me', {
    method: 'PUT',
    body: JSON.stringify({
      firstName,
      lastName: rest.join(' '),
      phone: payload.telefono.trim(),
      photoUrl: payload.fotoUrl?.trim() ?? '',
    }),
  });
  return toPerfil(owner);
};
