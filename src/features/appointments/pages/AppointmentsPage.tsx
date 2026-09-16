import React, { useState, useEffect } from "react";
import { Plus, Calendar, Clock, RefreshCw, XCircle, CheckCircle2 } from "lucide-react";
import {
  AppointmentStepperProvider,
  useStepperContext,
} from "../context/AppointmentStepperContext";
import { useSearchParams } from "react-router-dom";
import StepperAppointment from "../components/StepperAppointment";
import { CitasList } from "../components/CitasList";
import { getCitas, normalizarEstado } from "../../../services/citaService";
import { CitaDetallada } from "../../../types/cita.types";

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

  const [citas, setCitas] = useState<CitaDetallada[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const cargarCitas = () => {
    setIsLoading(true);
    try {
      const data = getCitas();
      setCitas(data);
    } catch (err) {
      console.error("Error al cargar las citas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, [isCreating]);

  const handleBack = () => {
    setSearchParams({});
    cargarCitas();
  };

  const handleCitaActualizada = (citaActualizada: CitaDetallada) => {
    setCitas((prev) =>
      prev.map((c) => (c.id === citaActualizada.id ? citaActualizada : c))
    );
  };

  // Contadores rápidos para la cabecera basados en normalizarEstado (US-17)
  const pendientesCount = citas.filter((c) => normalizarEstado(c.estado) === "pendiente").length;
  const confirmadasCount = citas.filter((c) => normalizarEstado(c.estado) === "confirmada").length;
  const canceladasCount = citas.filter((c) => normalizarEstado(c.estado) === "cancelada").length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {isCreating ? (
        <StepperAppointment onBack={handleBack} />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Header Principal de la Página */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 font-outfit tracking-tight">
                    Gestión de Citas Médicas
                  </h1>
                  <p className="text-xs text-slate-500">
                    Visualiza tus citas, filtra por estado (PENDIENTE, CONFIRMADA, CANCELADA), reprograma y gestiona atenciones médicas (US-17)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Contador de citas pendientes */}
              {pendientesCount > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{pendientesCount} pendiente{pendientesCount > 1 ? "s" : ""}</span>
                </div>
              )}

              {/* Contador de citas confirmadas */}
              {confirmadasCount > 0 && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span>{confirmadasCount} confirmada{confirmadasCount > 1 ? "s" : ""}</span>
                </div>
              )}

              {/* Contador de citas canceladas */}
              {canceladasCount > 0 && (
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{canceladasCount} cancelada{canceladasCount > 1 ? "s" : ""}</span>
                </div>
              )}

              <button
                onClick={cargarCitas}
                className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                title="Actualizar listado de citas"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={() => {
                  resetStepper();
                  setSearchParams({ action: "new" });
                }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-xl transition-all shadow-md shadow-[#0d9488]/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Cita</span>
              </button>
            </div>
          </div>

          {/* Listado de Citas con capacidad de filtrado, modificación (US-15) y cancelación (US-16) */}
          <CitasList
            citas={citas}
            onCitaActualizada={handleCitaActualizada}
          />
        </div>
      )}
    </div>
  );
};
