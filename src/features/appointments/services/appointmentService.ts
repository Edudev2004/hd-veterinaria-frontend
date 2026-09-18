export interface Appointment {
  id: string;
  petId: string | number;
  petName: string;
  vetId: number;
  vetName: string;
  specialty: string;
  date: string;
  startTime: string;
  motivo: string;
  status: "PENDIENTE" | "CONFIRMADA" | "CANCELADA";
  createdAt: string;
  motivoOriginal?: string;
  motivoCancelacion?: string;
}

export const APPOINTMENTS_STORAGE_KEY = "appointments";
const STORAGE_KEY = APPOINTMENTS_STORAGE_KEY;

export const DEFAULT_INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-20260920-001",
    petId: 1,
    petName: "Luna",
    vetId: 1,
    vetName: "Dr. Carlos López",
    specialty: "Cardiología",
    date: "2026-09-20",
    startTime: "09:00",
    motivo: "Control cardiológico y vacunación preventiva anual",
    status: "PENDIENTE",
    createdAt: new Date("2026-09-14T10:00:00.000Z").toISOString(),
    motivoOriginal: "Control cardiológico y vacunación preventiva anual",
  },
  {
    id: "APT-20260922-002",
    petId: 2,
    petName: "Max",
    vetId: 3,
    vetName: "Dr. Javier Martínez",
    specialty: "Dermatología",
    date: "2026-09-22",
    startTime: "11:30",
    motivo: "Revisión por alergia cutánea y picazón persistente",
    status: "PENDIENTE",
    createdAt: new Date("2026-09-15T11:15:00.000Z").toISOString(),
    motivoOriginal: "Revisión por alergia cutánea y picazón persistente",
  },
  {
    id: "APT-20260910-003",
    petId: 4,
    petName: "Milo",
    vetId: 9,
    vetName: "Dr. Miguel Ángel Ramírez",
    specialty: "Odontología",
    date: "2026-09-10",
    startTime: "15:00",
    motivo: "Limpieza dental preventiva",
    status: "CONFIRMADA",
    createdAt: new Date("2026-09-08T08:00:00.000Z").toISOString(),
    motivoOriginal: "Limpieza dental preventiva",
  },
  {
    id: "APT-20260912-004",
    petId: 3,
    petName: "Rocco",
    vetId: 7,
    vetName: "Dr. Roberto Sánchez",
    specialty: "Traumatología",
    date: "2026-09-12",
    startTime: "16:00",
    motivo: "[Cancelada: Dificultad para trasladar a la mascota] | Motivo original: Consulta ortopédica",
    status: "CANCELADA",
    createdAt: new Date("2026-09-11T14:00:00.000Z").toISOString(),
    motivoCancelacion: "Dificultad para trasladar a la mascota",
    motivoOriginal: "Consulta ortopédica",
  },
];

const generateId = (date: string): string => {
  const dateStr = date.replace(/-/g, "");
  const existing = getAppointments().filter((a) => a.id.startsWith(`APT-${dateStr}`));
  const seq = String(existing.length + 1).padStart(3, "0");
  return `APT-${dateStr}-${seq}`;
};

export const saveAppointment = (data: Omit<Appointment, "id" | "status" | "createdAt">): Appointment => {
  const appointment: Appointment = {
    ...data,
    id: generateId(data.date),
    status: "PENDIENTE",
    createdAt: new Date().toISOString(),
    motivoOriginal: data.motivo,
  };

  const appointments = getAppointments();
  appointments.push(appointment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));

  return appointment;
};

export const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_APPOINTMENTS));
    return DEFAULT_INITIAL_APPOINTMENTS;
  }
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_APPOINTMENTS));
      return DEFAULT_INITIAL_APPOINTMENTS;
    }
    return parsed as Appointment[];
  } catch {
    return DEFAULT_INITIAL_APPOINTMENTS;
  }
};

export const getAppointmentById = (id: string): Appointment | null => {
  const appointments = getAppointments();
  return appointments.find((a) => a.id === id) || null;
};

export const cancelAppointment = (id: string, motivoCancelacion: string): Appointment => {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === id);

  if (index === -1) {
    throw new Error(`La cita con identificador ${id} no fue encontrada.`);
  }

  const citaOriginal = appointments[index];
  if (citaOriginal.status === "CANCELADA") {
    throw new Error("La cita ya se encuentra cancelada.");
  }

  const textoMotivoCancelacion = motivoCancelacion.trim();
  const motivoOriginalLimpio = citaOriginal.motivoOriginal || citaOriginal.motivo || "";
  const motivoOriginalFormateado = motivoOriginalLimpio ? ` | Motivo inicial: ${motivoOriginalLimpio}` : "";

  const citaActualizada: Appointment = {
    ...citaOriginal,
    status: "CANCELADA",
    motivo: `[Cancelada: ${textoMotivoCancelacion}]${motivoOriginalFormateado}`,
    motivoCancelacion: textoMotivoCancelacion,
    motivoOriginal: motivoOriginalLimpio,
  };

  appointments[index] = citaActualizada;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  return citaActualizada;
};

export const updateAppointment = (updated: Partial<Appointment> & { id: string }): Appointment => {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === updated.id);

  if (index === -1) {
    throw new Error(`La cita con identificador ${updated.id} no fue encontrada.`);
  }

  const appt = appointments[index];
  const merged: Appointment = {
    ...appt,
    ...updated,
  };

  appointments[index] = merged;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  return merged;
};

export const isSlotAvailable = (vetId: number, date: string, startTime: string): boolean => {
  const appointments = getAppointments();
  return !appointments.some(
    (a) =>
      a.vetId === vetId &&
      a.date === date &&
      a.startTime === startTime &&
      a.status !== "CANCELADA"
  );
};
