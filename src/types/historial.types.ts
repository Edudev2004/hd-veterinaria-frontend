/**
 * Interfaces TypeScript para el Historial Clínico de Mascotas (US-19)
 * Basado estrictamente en el esquema relacional de bd-veterinaria-hd.sql
 * Tablas: 'citas', 'diagnosticos', 'mascotas', 'veterinarios', 'usuarios', 'especialidades'
 */

/**
 * Representa un registro de la tabla 'diagnosticos' en bd-veterinaria-hd.sql:
 * - id: uuid primary key
 * - cita_id: uuid not null unique references citas(id) on delete cascade
 * - diagnostico: text not null
 * - datos: text (signos vitales, peso, temperatura, datos complementarios)
 * - tratamiento: text (medicación prescrita, dosis y pautas terapéuticas)
 * - notas: text (observaciones clínicas y recomendaciones)
 * - created_at: timestamptz not null default now()
 */
export interface DiagnosticoDB {
  id: string;
  cita_id: string;
  diagnostico: string;
  datos?: string | null;
  tratamiento: string;
  notas?: string | null;
  created_at: string;
}

/**
 * Información del veterinario tratante responsable de la atención
 */
export interface VeterinarioTratante {
  id: string;
  nombre: string;
  especialidad: string;
  email?: string;
}

/**
 * Información resumida de la mascota para el expediente médico
 */
export interface MascotaExpediente {
  id: string;
  nombre: string;
  especie: string;
  raza?: string;
  sexo?: 'macho' | 'hembra';
  fecha_nacimiento?: string;
  foto_url?: string;
  propietario_id?: string;
  propietario_nombre?: string;
}

/**
 * Entrada consolidada del historial clínico para visualización (US-19)
 * Cumple con los requisitos funcionales:
 * - Fecha de atención
 * - Veterinario tratante
 * - Diagnóstico
 * - Tratamiento/medicación
 * - Observaciones
 */
export interface EntradaHistorialClinico {
  id: string; // ID del diagnóstico
  cita_id: string; // ID de la cita asociada
  mascota_id: string; // ID de la mascota paciente
  fecha_atencion: string; // Fecha y hora en que se brindó la atención (ISO 8601)
  veterinario: VeterinarioTratante; // Datos del veterinario tratante
  mascota: MascotaExpediente; // Datos de la mascota asociada
  motivo_consulta?: string | null; // Motivo por el cual acudió a consulta
  diagnostico: string; // Juicio clínico / diagnóstico médico
  tratamiento: string; // Prescripción farmacológica, posología y cuidados
  observaciones: string; // Observaciones clínicas, evolución o recomendaciones
  datos?: string | null; // Datos complementarios (ej. Peso: 15kg, Temp: 38.5°C)
  created_at: string; // Fecha de creación del registro clínico
}

/**
 * Resumen global del expediente médico de una mascota
 */
export interface HistorialMascotaResumen {
  mascota: MascotaExpediente;
  totalAtenciones: number;
  ultimaAtencion?: string | null;
  primeraAtencion?: string | null;
  entradas: EntradaHistorialClinico[];
}

/**
 * Parámetros de filtro para búsqueda dentro del historial clínico
 */
export interface FiltroHistorialParams {
  terminoBusqueda?: string; // Búsqueda libre en diagnóstico, tratamiento o veterinario
  fechaDesde?: string;
  fechaHasta?: string;
  veterinarioId?: string;
}

/**
 * Propiedades para el modal de consulta de historial clínico
 */
export interface ModalHistorialClinicoProps {
  isOpen: boolean;
  onClose: () => void;
  mascotaId?: string | null;
  mascotaNombre?: string | null;
}
