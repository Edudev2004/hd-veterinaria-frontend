import {
  CitaDetallada,
  ModificarCitaPayload,
  CancelarCitaPayload,
  CancelarCitaResult,
  MotivoCancelacionOpcion,
  VeterinarioDetallado,
  FranjaHorariaDisponible,
  MascotaCita,
  EstadoCita
} from '../types/cita.types';
import {
  getAppointments,
  cancelAppointment,
  updateAppointment,
  Appointment,
  APPOINTMENTS_STORAGE_KEY
} from '../features/appointments/services/appointmentService';
import petsMock from '../features/appointments/mocks/pets.json';
import vetsMock from '../features/appointments/mocks/veterinarians.json';

// Clave unificada de almacenamiento compartida con US-14
export const STORAGE_CITAS_KEY = APPOINTMENTS_STORAGE_KEY;

/**
 * Catálogo de motivos predefinidos comunes para la cancelación (US-16)
 */
export const MOTIVOS_CANCELACION_PRESET: MotivoCancelacionOpcion[] = [
  {
    id: 'emergencia_personal',
    titulo: 'Emergencia personal o familiar',
    descripcion: 'Surgió un imprevisto y no podré asistir a la hora pautada.'
  },
  {
    id: 'mejoria_mascota',
    titulo: 'Mejoría notable en la mascota',
    descripcion: 'La mascota ya no presenta síntomas y no requiere atención inmediata.'
  },
  {
    id: 'imposibilidad_traslado',
    titulo: 'Problemas de transporte o traslado',
    descripcion: 'Dificultad logística para llevar a la mascota a la veterinaria.'
  },
  {
    id: 'cambio_horario_incompatible',
    titulo: 'Horario incompatible',
    descripcion: 'Deseo cancelar para agendar en otra fecha u horario disponible.'
  },
  {
    id: 'error_agendamiento',
    titulo: 'Error involuntario al agendar',
    descripcion: 'Se eligió una mascota, veterinario o fecha equivocada.'
  },
  {
    id: 'otro',
    titulo: 'Otro motivo particular',
    descripcion: 'Se detallará la razón específica en el formulario.'
  }
];

/**
 * Transforma un registro Appointment de la clave 'appointments' a CitaDetallada para la UI
 */
const appointmentToCitaDetallada = (a: Appointment): CitaDetallada => {
  // Normalización de estados: CANCELADA -> cancelada; PENDIENTE / CONFIRMADA -> pendiente
  const estado: EstadoCita = a.status === 'CANCELADA' ? 'cancelada' : 'pendiente';

  // Combinación y formateo de fecha y hora a formato ISO 8601
  const fechaHoraIso = (() => {
    try {
      const d = new Date(`${a.date}T${a.startTime}:00`);
      return isNaN(d.getTime()) ? (a.createdAt || new Date().toISOString()) : d.toISOString();
    } catch {
      return a.createdAt || new Date().toISOString();
    }
  })();

  // Búsqueda de mascota en mock para enriquecer especie, raza y foto
  const petFound = (petsMock as any[]).find(
    (p) => p.id === a.petId || (a.petName && p.name.toLowerCase() === a.petName.toLowerCase())
  );

  const mascota: MascotaCita = {
    id: String(a.petId),
    propietario_id: 'prop-seed-01',
    nombre: a.petName || petFound?.name || 'Mascota',
    especie: petFound?.species?.toLowerCase() || 'canino',
    raza: petFound?.breed,
    foto_url: petFound?.image
  };

  // Búsqueda de veterinario en mock
  const vetFound = (vetsMock as any[]).find(
    (v) => v.id === a.vetId || (a.vetName && v.name.toLowerCase() === a.vetName.toLowerCase())
  );

  const veterinario: VeterinarioDetallado = {
    id: String(a.vetId),
    usuario_id: `usr-vet-${a.vetId}`,
    especialidad_id: `esp-${a.vetId}`,
    activo: true,
    nombre: a.vetName || vetFound?.name || 'Veterinario Asignado',
    email: `veterinario${a.vetId}@vethd.com`,
    especialidad_nombre: a.specialty || vetFound?.specialty || 'Medicina General'
  };

  return {
    id: a.id,
    mascota_id: String(a.petId),
    veterinario_id: String(a.vetId),
    fecha_hora: fechaHoraIso,
    estado,
    motivo: a.motivo || null,
    created_at: a.createdAt || new Date().toISOString(),
    mascota,
    veterinario
  };
};

/**
 * Obtiene el listado de veterinarios activos disponibles para agendamiento o modificación
 */
export const getVeterinarios = (): VeterinarioDetallado[] => {
  return (vetsMock as any[]).map((v) => ({
    id: String(v.id),
    usuario_id: `usr-vet-${v.id}`,
    especialidad_id: `esp-${v.specialty.toLowerCase().replace(/\s+/g, '-')}`,
    activo: true,
    nombre: v.name,
    email: `${v.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@vethd.com`,
    especialidad_nombre: v.specialty
  }));
};

/**
 * Obtiene todas las citas leyendo directamente de la clave 'appointments' en localStorage
 */
export const getCitas = (): CitaDetallada[] => {
  const appointments = getAppointments();
  return appointments
    .map(appointmentToCitaDetallada)
    .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
};

/**
 * Obtiene una cita específica por su identificador
 */
export const getCitaById = (id: string): CitaDetallada | null => {
  const appointments = getAppointments();
  const found = appointments.find((a) => a.id === id);
  if (!found) return null;
  return appointmentToCitaDetallada(found);
};

/**
 * Verifica la disponibilidad de franja horaria para un veterinario
 */
export const isHorarioDisponible = (
  veterinarioId: string,
  fechaHoraIso: string,
  excludeCitaId?: string
): boolean => {
  const appointments = getAppointments();
  const targetDate = new Date(fechaHoraIso);
  const dateStr = fechaHoraIso.split('T')[0];
  const hours = String(targetDate.getHours()).padStart(2, '0');
  const minutes = String(targetDate.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  const vetNum = Number(veterinarioId);

  return !appointments.some((a) => {
    if (excludeCitaId && a.id === excludeCitaId) return false;
    if (a.status === 'CANCELADA') return false;
    if (a.vetId !== vetNum) return false;

    return a.date === dateStr && a.startTime === timeStr;
  });
};

/**
 * Obtiene las franjas horarias disponibles para una fecha y veterinario específicos
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

  const appointments = getAppointments();
  const vetNum = Number(veterinarioId);

  return horasPosibles.map((hora) => {
    const fechaHoraIso = new Date(`${fecha}T${hora}:00`).toISOString();
    const esFuturo = new Date(fechaHoraIso).getTime() > Date.now();
    const ocupado = appointments.some(
      (a) =>
        a.vetId === vetNum &&
        a.date === fecha &&
        a.startTime === hora &&
        a.status !== 'CANCELADA' &&
        a.id !== excludeCitaId
    );

    return {
      hora,
      disponible: esFuturo && !ocupado
    };
  });
};

/**
 * Modifica una cita actualizando directamente el array 'appointments' en localStorage (US-15)
 */
export const modificarCita = async (payload: ModificarCitaPayload): Promise<CitaDetallada> => {
  // Simulación de latencia de red
  await new Promise((resolve) => setTimeout(resolve, 400));

  const appointments = getAppointments();
  const citaOriginal = appointments.find((c) => c.id === payload.id);
  if (!citaOriginal) {
    throw new Error('La cita solicitada no fue encontrada en el sistema.');
  }

  // Regla: No modificar citas canceladas
  if (citaOriginal.status === 'CANCELADA') {
    throw new Error('No es posible modificar una cita que ya ha sido cancelada.');
  }

  // Regla: Fecha futura válida
  const nuevaFechaHora = new Date(payload.fecha_hora);
  if (isNaN(nuevaFechaHora.getTime())) {
    throw new Error('La fecha y hora seleccionadas no son válidas.');
  }
  if (nuevaFechaHora.getTime() <= Date.now()) {
    throw new Error('La nueva fecha y hora de la cita debe ser posterior al momento actual.');
  }

  // Regla: Motivo mínimo 5 caracteres
  const motivoLimpio = payload.motivo ? payload.motivo.trim() : '';
  if (motivoLimpio.length < 5) {
    throw new Error('El motivo de la cita debe contener al menos 5 caracteres.');
  }

  const dateStr = nuevaFechaHora.toISOString().split('T')[0];
  const hours = String(nuevaFechaHora.getHours()).padStart(2, '0');
  const minutes = String(nuevaFechaHora.getMinutes()).padStart(2, '0');
  const startTime = `${hours}:${minutes}`;

  const vetIdTarget = payload.veterinario_id ? Number(payload.veterinario_id) : citaOriginal.vetId;
  const vetInfo = (vetsMock as any[]).find((v) => v.id === vetIdTarget);

  const updatedAppt = updateAppointment({
    id: payload.id,
    date: dateStr,
    startTime,
    motivo: motivoLimpio,
    vetId: vetIdTarget,
    vetName: vetInfo ? vetInfo.name : citaOriginal.vetName,
    specialty: vetInfo ? vetInfo.specialty : citaOriginal.specialty
  });

  return appointmentToCitaDetallada(updatedAppt);
};

/**
 * Cancela una cita actualizando su campo status a "CANCELADA" en 'appointments' (US-16)
 */
export const cancelarCita = async (payload: CancelarCitaPayload): Promise<CancelarCitaResult> => {
  // Simulación de latencia de red
  await new Promise((resolve) => setTimeout(resolve, 400));

  const motivoLimpio = (payload.motivo_cancelacion || '').trim();
  if (motivoLimpio.length < 5) {
    throw new Error('Debes indicar un motivo de cancelación con al menos 5 caracteres.');
  }

  // cancelAppointment valida estado y actualiza status a 'CANCELADA' en localStorage("appointments")
  const apptCancelada = cancelAppointment(payload.id, motivoLimpio);
  const citaDetallada = appointmentToCitaDetallada(apptCancelada);

  // Notificación emulada en localStorage
  try {
    const STORAGE_NOTIF_KEY = 'vethd_db_notificaciones';
    const notifs = JSON.parse(localStorage.getItem(STORAGE_NOTIF_KEY) || '[]');
    notifs.push({
      id: `notif-${Date.now()}`,
      usuario_id: String(apptCancelada.vetId),
      mensaje: `La cita para ${apptCancelada.petName} programada para el ${apptCancelada.date} ${apptCancelada.startTime} ha sido cancelada. Motivo: ${motivoLimpio}`,
      leido: false,
      created_at: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(notifs));
  } catch {
    // Continuar si localStorage no está disponible
  }

  return {
    cita: citaDetallada,
    mensaje: `La cita para "${citaDetallada.mascota.nombre}" ha sido cancelada exitosamente.`,
    fecha_cancelacion: new Date().toISOString()
  };
};

export const citaService = {
  getCitas,
  getCitaById,
  getVeterinarios,
  getHorariosDisponibles,
  isHorarioDisponible,
  modificarCita,
  cancelarCita,
  MOTIVOS_CANCELACION_PRESET
};
