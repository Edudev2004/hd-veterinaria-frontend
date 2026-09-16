import {
  Cita,
  CitaDetallada,
  ModificarCitaPayload,
  VeterinarioDetallado,
  FranjaHorariaDisponible,
  MascotaCita
} from '../types/cita.types';
import { getCurrentUser } from './authService';

const STORAGE_CITAS_KEY = 'vethd_db_citas';
const STORAGE_MASCOTAS_KEY = 'vethd_db_mascotas';

// Catálogo de veterinarios con datos relacionales acordes a bd-veterinaria-hd.sql
const DEFAULT_VETERINARIOS: VeterinarioDetallado[] = [
  {
    id: 'vet-uuid-001',
    usuario_id: 'usr-seed-vet-01',
    especialidad_id: 'esp-uuid-001',
    activo: true,
    nombre: 'Dra. Laura Veterinario',
    email: 'veterinario@vethd.com',
    especialidad_nombre: 'Medicina General y Preventiva'
  },
  {
    id: 'vet-uuid-002',
    usuario_id: 'usr-seed-vet-02',
    especialidad_id: 'esp-uuid-002',
    activo: true,
    nombre: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@vethd.com',
    especialidad_nombre: 'Cardiología'
  },
  {
    id: 'vet-uuid-003',
    usuario_id: 'usr-seed-vet-03',
    especialidad_id: 'esp-uuid-003',
    activo: true,
    nombre: 'Dra. Andrea Morales',
    email: 'andrea.morales@vethd.com',
    especialidad_nombre: 'Dermatología'
  },
  {
    id: 'vet-uuid-004',
    usuario_id: 'usr-seed-vet-04',
    especialidad_id: 'esp-uuid-004',
    activo: true,
    nombre: 'Dr. Roberto Gómez',
    email: 'roberto.gomez@vethd.com',
    especialidad_nombre: 'Cirugía y Traumatología'
  }
];

// Semillas de mascotas de prueba por si no existen en localStorage
const DEFAULT_SEED_MASCOTAS: MascotaCita[] = [
  {
    id: 'pet-seed-001',
    propietario_id: 'prop-seed-01',
    nombre: 'Rocky',
    especie: 'perro',
    raza: 'Golden Retriever',
    foto_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'pet-seed-002',
    propietario_id: 'prop-seed-01',
    nombre: 'Milo',
    especie: 'gato',
    raza: 'Siamés',
    foto_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'pet-seed-003',
    propietario_id: 'prop-seed-01',
    nombre: 'Luna',
    especie: 'perro',
    raza: 'Beagle',
    foto_url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=300'
  }
];

// Semillas iniciales de citas respetando bd-veterinaria-hd.sql
const DEFAULT_SEED_CITAS: Cita[] = [
  {
    id: 'cita-uuid-001',
    mascota_id: 'pet-seed-001',
    veterinario_id: 'vet-uuid-001',
    fecha_hora: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] + 'T09:00:00.000Z',
    estado: 'pendiente',
    motivo: 'Vacunación anual y desparasitación preventiva de rutina',
    created_at: new Date('2026-03-01T10:00:00.000Z').toISOString()
  },
  {
    id: 'cita-uuid-002',
    mascota_id: 'pet-seed-002',
    veterinario_id: 'vet-uuid-002',
    fecha_hora: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0] + 'T11:30:00.000Z',
    estado: 'pendiente',
    motivo: 'Control cardiológico por fatiga leve tras paseos',
    created_at: new Date('2026-03-02T11:15:00.000Z').toISOString()
  },
  {
    id: 'cita-uuid-003',
    mascota_id: 'pet-seed-003',
    veterinario_id: 'vet-uuid-003',
    fecha_hora: '2026-02-15T15:00:00.000Z',
    estado: 'atendida',
    motivo: 'Revisión por alergia dermatológica en la piel',
    created_at: new Date('2026-02-10T08:00:00.000Z').toISOString()
  },
  {
    id: 'cita-uuid-004',
    mascota_id: 'pet-seed-001',
    veterinario_id: 'vet-uuid-004',
    fecha_hora: '2026-02-20T16:00:00.000Z',
    estado: 'cancelada',
    motivo: 'Consulta ortopédica preventiva',
    created_at: new Date('2026-02-18T14:00:00.000Z').toISOString()
  }
];

/**
 * Obtiene las citas brutas almacenadas en LocalStorage
 */
export const getStoredCitas = (): Cita[] => {
  const data = localStorage.getItem(STORAGE_CITAS_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_CITAS_KEY, JSON.stringify(DEFAULT_SEED_CITAS));
    return DEFAULT_SEED_CITAS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_SEED_CITAS;
  }
};

/**
 * Guarda las citas en LocalStorage
 */
const saveStoredCitas = (citas: Cita[]): void => {
  localStorage.setItem(STORAGE_CITAS_KEY, JSON.stringify(citas));
};

/**
 * Obtiene las mascotas almacenadas o las semillas por defecto
 */
const getMascotasRegistradas = (): MascotaCita[] => {
  const data = localStorage.getItem(STORAGE_MASCOTAS_KEY);
  if (!data) return DEFAULT_SEED_MASCOTAS;
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_SEED_MASCOTAS;
    return parsed.map((m: any) => ({
      id: m.id,
      propietario_id: m.propietarioId || m.propietario_id || 'prop-seed-01',
      nombre: m.nombre,
      especie: m.especie,
      raza: m.raza,
      foto_url: m.fotoUrl || m.foto_url
    }));
  } catch {
    return DEFAULT_SEED_MASCOTAS;
  }
};

/**
 * Une un registro Cita con su Mascota y su Veterinario
 */
const enriquecerCita = (cita: Cita): CitaDetallada => {
  const mascotas = getMascotasRegistradas();
  const mascota = mascotas.find((m) => m.id === cita.mascota_id) || {
    id: cita.mascota_id,
    propietario_id: 'desconocido',
    nombre: 'Mascota no identificada',
    especie: 'otro'
  };

  const veterinario = DEFAULT_VETERINARIOS.find((v) => v.id === cita.veterinario_id) || {
    id: cita.veterinario_id,
    usuario_id: 'usr-unknown',
    especialidad_id: 'esp-unknown',
    activo: true,
    nombre: 'Veterinario asignado',
    email: 'contacto@vethd.com',
    especialidad_nombre: 'Medicina General'
  };

  return {
    ...cita,
    mascota,
    veterinario
  };
};

/**
 * Obtiene el listado de veterinarios activos
 */
export const getVeterinarios = (): VeterinarioDetallado[] => {
  return DEFAULT_VETERINARIOS.filter((v) => v.activo);
};

/**
 * Obtiene todas las citas detalladas, opcionalmente filtradas por propietario
 */
export const getCitas = (propietarioId?: string): CitaDetallada[] => {
  const currentUser = getCurrentUser();
  const targetPropietarioId = propietarioId || currentUser?.propietarioId || 'prop-seed-01';

  const citas = getStoredCitas();
  const mascotas = getMascotasRegistradas();
  const idsMascotasPropietario = mascotas
    .filter((m) => m.propietario_id === targetPropietarioId)
    .map((m) => m.id);

  return citas
    .filter((c) => idsMascotasPropietario.includes(c.mascota_id))
    .map(enriquecerCita)
    .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
};

/**
 * Obtiene una cita por su ID
 */
export const getCitaById = (id: string): CitaDetallada | null => {
  const citas = getStoredCitas();
  const cita = citas.find((c) => c.id === id);
  if (!cita) return null;
  return enriquecerCita(cita);
};

/**
 * Verifica si un horario específico está disponible para un veterinario determinado
 */
export const isHorarioDisponible = (
  veterinarioId: string,
  fechaHoraIso: string,
  excludeCitaId?: string
): boolean => {
  const citas = getStoredCitas();
  const targetTime = new Date(fechaHoraIso).getTime();

  return !citas.some((c) => {
    if (excludeCitaId && c.id === excludeCitaId) return false;
    if (c.estado === 'cancelada') return false;
    if (c.veterinario_id !== veterinarioId) return false;

    const citaTime = new Date(c.fecha_hora).getTime();
    return Math.abs(citaTime - targetTime) < 30 * 60 * 1000; // Franjas de 30 minutos
  });
};

/**
 * Genera franjas horarias disponibles para una fecha y veterinario específicos
 */
export const getHorariosDisponibles = (
  veterinarioId: string,
  fecha: string, // YYYY-MM-DD
  excludeCitaId?: string
): FranjaHorariaDisponible[] => {
  const horasPosibles = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  return horasPosibles.map((hora) => {
    const fechaHoraIso = new Date(`${fecha}T${hora}:00`).toISOString();
    const esFuturo = new Date(fechaHoraIso).getTime() > Date.now();
    const libre = isHorarioDisponible(veterinarioId, fechaHoraIso, excludeCitaId);

    return {
      hora,
      disponible: esFuturo && libre
    };
  });
};

/**
 * US-15: Modificar Cita
 * Valida reglas de negocio y actualiza los campos permitidos de la cita
 */
export const modificarCita = async (payload: ModificarCitaPayload): Promise<CitaDetallada> => {
  // Simulación de latencia de red realista
  await new Promise((resolve) => setTimeout(resolve, 400));

  const citas = getStoredCitas();
  const index = citas.findIndex((c) => c.id === payload.id);

  if (index === -1) {
    throw new Error('La cita solicitada no fue encontrada en el sistema.');
  }

  const citaOriginal = citas[index];

  // Regla 1: Solo citas pendientes pueden ser modificadas
  if (citaOriginal.estado !== 'pendiente') {
    throw new Error(
      `No es posible modificar esta cita porque se encuentra en estado '${citaOriginal.estado}'. Solo se pueden modificar citas en estado 'pendiente'.`
    );
  }

  // Regla 2: La nueva fecha_hora debe ser válida y estar en el futuro
  const nuevaFechaHora = new Date(payload.fecha_hora);
  if (isNaN(nuevaFechaHora.getTime())) {
    throw new Error('La fecha y hora seleccionadas no son válidas.');
  }
  if (nuevaFechaHora.getTime() <= Date.now()) {
    throw new Error('La nueva fecha y hora de la cita debe ser posterior al momento actual.');
  }

  // Regla 3: El motivo debe ser válido y tener al menos 5 caracteres
  const motivoLimpio = payload.motivo ? payload.motivo.trim() : '';
  if (motivoLimpio.length < 5) {
    throw new Error('El motivo de la cita debe contener al menos 5 caracteres.');
  }

  // Regla 4: Disponibilidad del veterinario
  const veterinarioDestinoId = payload.veterinario_id || citaOriginal.veterinario_id;
  const disponible = isHorarioDisponible(veterinarioDestinoId, payload.fecha_hora, citaOriginal.id);
  if (!disponible) {
    throw new Error('El veterinario ya cuenta con una cita programada en ese horario. Por favor, selecciona otra hora.');
  }

  // Actualización de campos de acuerdo a la tabla citas
  const citaActualizada: Cita = {
    ...citaOriginal,
    fecha_hora: nuevaFechaHora.toISOString(),
    motivo: motivoLimpio,
    veterinario_id: veterinarioDestinoId,
    mascota_id: payload.mascota_id || citaOriginal.mascota_id
  };

  citas[index] = citaActualizada;
  saveStoredCitas(citas);

  return enriquecerCita(citaActualizada);
};

export const citaService = {
  getCitas,
  getCitaById,
  getVeterinarios,
  getHorariosDisponibles,
  isHorarioDisponible,
  modificarCita
};

