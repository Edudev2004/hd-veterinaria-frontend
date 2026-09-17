export type EstadoCita = 'pendiente' | 'atendida' | 'no_atendida' | 'cancelada';

export interface MascotaResumen {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  descripcion: string;
  fotoUrl?: string;
}

export interface PropietarioResumen {
  id: string;
  nombre: string;
  telefono: string;
  fotoUrl?: string;
}

export interface CitaAgenda {
  id: string;
  mascota_id: string;
  veterinario_id: string;
  fecha_hora: string;
  estado: EstadoCita;
  motivo: string;
  created_at: string;
  mascota: MascotaResumen;
  propietario: PropietarioResumen;
}