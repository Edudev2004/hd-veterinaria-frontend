import { useEffect, useState } from "react";
import { useStepperContext } from "../context/AppointmentStepperContext";
import { getEspecialidades } from "../../../services/citaService";
import type { Specialty } from "../types/appointment.types";
import { AlertCircle, Loader2, Stethoscope } from "lucide-react";

export const StepSpecialtySelection = () => {
  const { setSpecialty } = useStepperContext();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const cargarEspecialidades = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getEspecialidades();
        if (active) {
          setSpecialties(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las especialidades.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void cargarEspecialidades();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d9488] mb-3" />
        <p className="text-sm font-medium">Cargando especialidades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">No se pudieron cargar las especialidades</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Selecciona una Especialidad
        </h2>
        <p className="text-sm text-slate-500">
          Elige la especialidad que necesita tu mascota
        </p>
      </div>

      {specialties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Stethoscope className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-500">
            No hay especialidades disponibles
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Contacta con la clínica para más información.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => setSpecialty(specialty)}
              className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#0d9488] hover:bg-teal-50/50 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-[#0d9488]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                <Stethoscope className="w-5 h-5 text-slate-400 group-hover:text-[#0d9488] transition-colors" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors">
                  {specialty.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {specialty.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
