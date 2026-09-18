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

export const DEFAULT_SEED_MASCOTAS: Mascota[] = [
  {
    id: '1',
    propietarioId: 'prop-seed-01',
    nombre: 'Luna',
    especie: 'perro',
    raza: 'Golden Retriever',
    sexo: 'hembra',
    fechaNacimiento: '2023-04-10',
    fotoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: '2',
    propietarioId: 'prop-seed-01',
    nombre: 'Max',
    especie: 'gato',
    raza: 'Bombay',
    sexo: 'macho',
    fechaNacimiento: '2025-01-15',
    fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-02-15T12:00:00.000Z'
  },
  {
    id: '3',
    propietarioId: 'prop-seed-01',
    nombre: 'Rocco',
    especie: 'perro',
    raza: 'Bulldog Francés',
    sexo: 'macho',
    fechaNacimiento: '2024-06-20',
    fotoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-03-01T09:00:00.000Z'
  },
  {
    id: '4',
    propietarioId: 'prop-seed-01',
    nombre: 'Milo',
    especie: 'gato',
    raza: 'Siamés',
    sexo: 'macho',
    fechaNacimiento: '2022-09-05',
    fotoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-01-20T14:30:00.000Z'
  },
  {
    id: '5',
    propietarioId: 'prop-seed-01',
    nombre: 'Canela',
    especie: 'perro',
    raza: 'Labrador Retriever',
    sexo: 'hembra',
    fechaNacimiento: '2021-03-12',
    fotoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-01-05T08:15:00.000Z'
  }
];

const getStoredMascotas = (): Mascota[] => {
  const data = localStorage.getItem(STORAGE_MASCOTAS_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_MASCOTAS_KEY, JSON.stringify(DEFAULT_SEED_MASCOTAS));
    return DEFAULT_SEED_MASCOTAS;
  }
  try {
    const parsed: Mascota[] = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_MASCOTAS_KEY, JSON.stringify(DEFAULT_SEED_MASCOTAS));
      return DEFAULT_SEED_MASCOTAS;
    }
    return parsed;
  } catch {
    return DEFAULT_SEED_MASCOTAS;
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

export const getAllPets = (): Mascota[] => {
  return getStoredMascotas();
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
