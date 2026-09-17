import { getCurrentUser } from "./authService";
export type Especie = "perro" | "gato" | "otro";
export type Sexo = "macho" | "hembra";

export interface Mascota {
  id: string;
  propietarioId: string;
  nombre: string;
  especie: Especie;
  raza?: string;
  sexo: Sexo;
  fechaNacimiento?: string;
  fotoUrl?: string;
  createdAt: string;
}

export interface RegisterPetPayload {
  nombre: string;
  especie: Especie;
  raza?: string;
  sexo: Sexo;
  fechaNacimiento?: string;
  fotoUrl?: string;
}

const STORAGE_MASCOTAS_KEY = "vethd_db_mascotas";

const getStoredMascotas = (): Mascota[] => {
  const data = localStorage.getItem(STORAGE_MASCOTAS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};
export const registerPet = async (
  payload: RegisterPetPayload,
): Promise<Mascota> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.propietarioId) {
    throw new Error(
      "Debes iniciar sesión como propietario para registrar una mascota.",
    );
  }

  if (!payload.nombre.trim()) {
    throw new Error("El nombre de la mascota es obligatorio.");
  }

  const mascotas = getStoredMascotas();

  const newMascota: Mascota = {
    id: crypto.randomUUID ? crypto.randomUUID() : `pet-${Date.now()}`,
    propietarioId: currentUser.propietarioId,
    nombre: payload.nombre.trim(),
    especie: payload.especie,
    raza: payload.raza?.trim() || undefined,
    sexo: payload.sexo,
    fechaNacimiento: payload.fechaNacimiento || undefined,
    fotoUrl: payload.fotoUrl || undefined,
    createdAt: new Date().toISOString(),
  };

  mascotas.push(newMascota);
  localStorage.setItem(STORAGE_MASCOTAS_KEY, JSON.stringify(mascotas));

  return newMascota;
};

export const getMyPets = (): Mascota[] => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.propietarioId) return [];

  const mascotas = getStoredMascotas();
  return mascotas.filter((m) => m.propietarioId === currentUser.propietarioId);
};
export const updatePet = async (
  id: string,
  payload: RegisterPetPayload,
): Promise<Mascota> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.propietarioId) {
    throw new Error(
      "Debes iniciar sesión como propietario para editar una mascota.",
    );
  }

  if (!payload.nombre.trim()) {
    throw new Error("El nombre de la mascota es obligatorio.");
  }

  const mascotas = getStoredMascotas();
  const index = mascotas.findIndex((m) => m.id === id);

  if (index === -1) {
    throw new Error("No se encontró la mascota a editar.");
  }

  if (mascotas[index].propietarioId !== currentUser.propietarioId) {
    throw new Error("No tienes permiso para editar esta mascota.");
  }

  const updatedMascota: Mascota = {
    ...mascotas[index],
    nombre: payload.nombre.trim(),
    especie: payload.especie,
    raza: payload.raza?.trim() || undefined,
    sexo: payload.sexo,
    fechaNacimiento: payload.fechaNacimiento || undefined,
    fotoUrl: payload.fotoUrl || undefined,
  };

  mascotas[index] = updatedMascota;
  localStorage.setItem(STORAGE_MASCOTAS_KEY, JSON.stringify(mascotas));

  return updatedMascota;
};
