export type Especie = "perro" | "gato" | "otro";
export type Sexo = "macho" | "hembra";

export interface Mascota {
  id: string;
  propietarioId?: string;
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

// Nota: la implementación de mascotas vive en `petApi.ts` (API real).
// Este módulo conserva únicamente los tipos de dominio compartidos.
