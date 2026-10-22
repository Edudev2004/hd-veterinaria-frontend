import type { CitaDetallada } from "../../../types/cita.types";
import {
  Stethoscope,
  User,
  PawPrint,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface ConfirmationViewProps {
  appointment: CitaDetallada;
  onBackToList: () => void;
}

const formatFecha = (fechaHora: string): string => {
  const fecha = new Date(fechaHora);
  if (Number.isNaN(fecha.getTime())) return fechaHora;
  return fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatHora = (fechaHora: string): string => {
  const fecha = new Date(fechaHora);
  if (Number.isNaN(fecha.getTime())) return "";
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ConfirmationView = ({
  appointment,
  onBackToList,
}: ConfirmationViewProps) => {
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">
          Cita Agendada Exitosamente
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Tu cita fue registrada con estado Pendiente
        </p>
      </div>

      <div className="w-full max-w-md bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-sm">
          <Stethoscope className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500">Especialidad:</span>
          <span className="font-medium text-slate-900">
            {appointment.veterinario.especialidad_nombre || "Medicina General"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <User className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500">Veterinario:</span>
          <span className="font-medium text-slate-900">
            {appointment.veterinario.nombre}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <PawPrint className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500">Mascota:</span>
          <span className="font-medium text-slate-900">
            {appointment.mascota.nombre}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500">Fecha:</span>
          <span className="font-medium text-slate-900 capitalize">
            {formatFecha(appointment.fecha_hora)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500">Hora:</span>
          <span className="font-medium text-slate-900">
            {formatHora(appointment.fecha_hora)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FileText className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500">ID:</span>
          <span className="font-medium text-slate-900">
            {appointment.id}
          </span>
        </div>
      </div>

      <button
        onClick={onBackToList}
        className="px-6 py-2.5 text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-xl transition-colors"
      >
        Volver a Mis Citas
      </button>
    </div>
  );
};
