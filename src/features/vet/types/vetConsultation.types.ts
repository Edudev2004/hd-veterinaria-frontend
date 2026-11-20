export interface RegistroAtencion {
  id: string;
  citaId: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
  createdAt: string;
}

export interface GuardarAtencionInput {
  citaId: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
}