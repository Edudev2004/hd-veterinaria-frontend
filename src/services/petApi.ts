import { apiRequest } from './apiClient';
import { Especie, Mascota, RegisterPetPayload, Sexo } from './petService';

interface PetDTO {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  gender: string;
  birthDate: string | null;
  photoUrl: string | null;
  createdAt: string | null;
}

const toMascota = (pet: PetDTO): Mascota => ({
  id: pet.id,
  nombre: pet.name,
  especie: pet.species as Especie,
  raza: pet.breed ?? undefined,
  sexo: pet.gender as Sexo,
  fechaNacimiento: pet.birthDate ?? undefined,
  fotoUrl: pet.photoUrl ?? undefined,
  createdAt: pet.createdAt ?? new Date().toISOString(),
});

const toPetRequest = (payload: RegisterPetPayload) => ({
  name: payload.nombre.trim(),
  species: payload.especie,
  breed: payload.raza?.trim() || null,
  gender: payload.sexo,
  birthDate: payload.fechaNacimiento || null,
  photoUrl: payload.fotoUrl || null,
});

export const registerPet = async (payload: RegisterPetPayload): Promise<Mascota> => {
  const pet = await apiRequest<PetDTO>('/api/mascotas', {
    method: 'POST',
    body: toPetRequest(payload),
  });
  return toMascota(pet);
};

export const getMyPets = async (): Promise<Mascota[]> => {
  const pets = await apiRequest<PetDTO[]>('/api/mascotas');
  return pets.map(toMascota);
};

export const updatePet = async (id: string, payload: RegisterPetPayload): Promise<Mascota> => {
  const pet = await apiRequest<PetDTO>(`/api/mascotas/${id}`, {
    method: 'PUT',
    body: toPetRequest(payload),
  });
  return toMascota(pet);
};
