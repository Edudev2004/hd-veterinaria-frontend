/**
 * Interfaces TypeScript para la entidad Citas y entidades relacionadas
 * Basado estrictamente en el esquema relacional de bd-veterinaria-hd.sql
 */

// Estados permitidos según check constraint en bd-veterinaria-hd.sql:
// check (estado in ('pendiente', 'atendida', 'no_atendida', 'cancelada'))
export type EstadoCita = 'pendiente' | 'atendida' | 'no_atendida' | 'cancelada';

/**
 * Representa un registro de la tabla 'citas' en la base de datos
 */
export interface Cita {
  id: string; // uuid primary key default gen_random_uuid()
  mascota_id: string; // uuid references mascotas(id) on delete cascade
  veterinario_id: string; // uuid references veterinarios(id)
  fecha_hora: string; // timestamptz not null (formato ISO 8601)
  estado: EstadoCita; // varchar(20) not null default 'pendiente'
  motivo: string | null; // text
  created_at: string; // timestamptz not null default now()
}

/**
 * Representa un registro de la tabla 'especialidades'
 */
export interface Especialidad {
  id: string; // uuid primary key
  nombre: string; // varchar(100) not null unique
}

/**
 * Representa un registro de la tabla 'veterinarios' con datos relacionales para la UI
 */
export interface VeterinarioDetallado {
  id: string; // uuid (veterinarios.id)
  usuario_id: string; // uuid references usuarios(id)
  especialidad_id: string; // uuid references especialidades(id)
  activo: boolean; // boolean not null default true
  nombre: string; // usuarios.nombre
  email: string; // usuarios.email
  especialidad_nombre: string; // especialidades.nombre
}

/**
 * Representa un registro de la tabla 'mascotas'
 */
export interface MascotaCita {
  id: string; // uuid primary key
  propietario_id: string; // uuid references propietarios(id)
  nombre: string; // varchar(100) not null
  especie: string; // varchar(50) not null
  raza?: string; // varchar(50)
  foto_url?: string; // text
}

/**
 * Cita con información unida de las tablas mascotas, veterinarios, usuarios y especialidades
 * para el renderizado en vistas y componentes
 */
export interface CitaDetallada extends Cita {
  mascota: MascotaCita;
  veterinario: VeterinarioDetallado;
}

/**
 * Payload para modificar/reprogramar una cita existente (US-15)
 * Permite cambiar fecha y hora, motivo, y opcionalmente reasignar veterinario o mascota
 */
export interface ModificarCitaPayload {
  id: string; // ID de la cita a modificar
  fecha_hora: string; // Nueva fecha y hora (ISO)
  motivo: string; // Nuevo o modificado motivo de la cita
  veterinario_id?: string; // En caso de reasignar veterinario
  mascota_id?: string; // En caso de corregir la mascota
}

/**
 * Horario de disponibilidad de la tabla 'horarios_disponibilidad'
 */
export interface HorarioDisponibilidad {
  id: string; // uuid
  veterinario_id: string; // uuid
  dia_semana: number; // smallint (0 a 6)
  hora_inicio: string; // time (ej: "08:00")
  hora_fin: string; // time (ej: "17:00")
}

/**
 * Franja horaria disponible para agendamiento/reprogramación
 */
export interface FranjaHorariaDisponible {
  hora: string; // formato "HH:mm"
  disponible: boolean;
}

/**
 * Errores de validación para el formulario de modificación de cita
 */
export interface ModificarCitaValidationErrors {
  fecha_hora?: string;
  motivo?: string;
  veterinario_id?: string;
  general?: string;
}

/**
 * Filtros para el listado de citas
 */
export interface CitasFilterParams {
  estado?: EstadoCita | 'todos';
  terminoBusqueda?: string;
  fecha?: string;
}

/**
 * Categorías o motivos predefinidos comunes para la cancelación de una cita (US-16)
 */
export type MotivoCancelacionCategoria =
  | 'emergencia_personal'
  | 'mejoria_mascota'
  | 'imposibilidad_traslado'
  | 'cambio_horario_incompatible'
  | 'error_agendamiento'
  | 'otro';

export interface MotivoCancelacionOpcion {
  id: MotivoCancelacionCategoria;
  titulo: string;
  descripcion: string;
}

/**
 * Payload para procesar la cancelación de una cita existente (US-16)
 * Estado destino: 'cancelada' según constraint check en bd-veterinaria-hd.sql:
 * check (estado in ('pendiente', 'atendida', 'no_atendida', 'cancelada'))
 */
export interface CancelarCitaPayload {
  id: string; // UUID de la cita a cancelar
  motivo_cancelacion: string; // Justificación de la cancelación
  categoria_motivo?: MotivoCancelacionCategoria; // Categoría seleccionada
}

/**
 * Errores de validación para el formulario y modal de cancelación
 */
export interface CancelarCitaValidationErrors {
  motivo_cancelacion?: string;
  general?: string;
}

/**
 * Resultado devuelto tras la cancelación exitosa de una cita
 */
export interface CancelarCitaResult {
  cita: CitaDetallada;
  mensaje: string;
  fecha_cancelacion: string;
}

