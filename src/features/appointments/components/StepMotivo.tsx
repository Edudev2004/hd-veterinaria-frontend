import { useStepperContext } from "../context/AppointmentStepperContext";
import { FileText } from "lucide-react";

export const StepMotivo = () => {
  const { motivo, setMotivo } = useStepperContext();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Motivo de la Consulta
        </h2>
        <p className="text-sm text-slate-500">
          Describe brevemente el motivo de la cita
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FileText className="w-4 h-4 text-[#0d9488]" />
          <span className="font-medium">Escribe el motivo</span>
        </div>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ej: Vacunación anual, revisión general, consulta por dolor..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 resize-none transition-all"
        />
        <p className="text-xs text-slate-400">
          Mínimo 3 caracteres
        </p>
      </div>
    </div>
  );
};
