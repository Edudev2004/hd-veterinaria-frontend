export interface RegistroAtencion {
  id: string;
  citaId: string;
  veterinarioId: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuardarAtencionInput {
  citaId: string;
  veterinarioId: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
}