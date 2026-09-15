export interface Appointment {
  id: string;
  petId: number;
  petName: string;
  vetId: number;
  vetName: string;
  specialty: string;
  date: string;
  startTime: string;
  motivo: string;
  status: "PENDIENTE" | "CONFIRMADA" | "CANCELADA";
  createdAt: string;
}

const STORAGE_KEY = "appointments";

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
  };

  const appointments = getAppointments();
  appointments.push(appointment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));

  return appointment;
};

export const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Appointment[];
  } catch {
    return [];
  }
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
