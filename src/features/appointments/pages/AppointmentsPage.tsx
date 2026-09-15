import React from "react";
import { Calendar, Plus } from "lucide-react";
import {
  AppointmentStepperProvider,
  useStepperContext,
} from "../context/AppointmentStepperContext";
import { useSearchParams } from "react-router-dom";
import StepperAppointment from "../components/StepperAppointment";

export const AppointmentsPage: React.FC = () => {
  return (
    <AppointmentStepperProvider>
      <AppointmentsContent />
    </AppointmentStepperProvider>
  );
};

const AppointmentsContent: React.FC = () => {
  const { resetStepper } = useStepperContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreating = searchParams.get("action") === "new";

  const handleBack = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-col gap-6">
      {isCreating ? (
        <StepperAppointment onBack={handleBack} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-outfit">
                Mis Citas
              </h1>
              <p className="text-sm text-slate-500">
                Historial y agendamiento de atenciones médicas
              </p>
            </div>
            <button
              onClick={() => {
                resetStepper();
                setSearchParams({ action: "new" });
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Cita
            </button>
          </div>

          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Espacio de Trabajo: Módulo de Citas
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              Los desarrolladores asignados a la US-14 a US-18 pueden
              implementar sus componentes dentro de{" "}
              <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-600">
                src/pages/AppointmentsPage.tsx
              </code>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
