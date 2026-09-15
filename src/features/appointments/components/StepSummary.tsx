import { useStepperContext } from "../context/AppointmentStepperContext";
import {
  Stethoscope,
  User,
  PawPrint,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";

export const StepSummary = () => {
  const { selectedSpecialty, selectedVet, selectedPet, selectedSlot, motivo } =
    useStepperContext();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Resumen de la Cita
        </h2>
        <p className="text-sm text-slate-500">
          Revisá los datos antes de confirmar
        </p>
      </div>

      <div className="flex flex-col gap-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-3 text-sm">
          <Stethoscope className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500 w-28">Especialidad</span>
          <span className="font-medium text-slate-900">
            {selectedSpecialty?.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <User className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500 w-28">Veterinario</span>
          <span className="font-medium text-slate-900">
            {selectedVet?.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <PawPrint className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500 w-28">Mascota</span>
          <span className="font-medium text-slate-900">
            {selectedPet?.name} ({selectedPet?.species} - {selectedPet?.breed})
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500 w-28">Fecha</span>
          <span className="font-medium text-slate-900">
            {selectedSlot?.date}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-[#0d9488]" />
          <span className="text-slate-500 w-28">Hora</span>
          <span className="font-medium text-slate-900">
            {selectedSlot?.startTime}
          </span>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <FileText className="w-4 h-4 text-[#0d9488] mt-0.5" />
          <span className="text-slate-500 w-28">Motivo</span>
          <span className="font-medium text-slate-900">{motivo}</span>
        </div>
      </div>
    </div>
  );
};
