import { useEffect, useState } from "react";
import { useStepperContext } from "../context/AppointmentStepperContext";
import { getVeterinarios } from "../../../services/citaService";
import type { VeterinarioDetallado } from "../../../types/cita.types";
import type { Veterinarian } from "../types/appointment.types";
import { AlertCircle, Loader2, Star, User } from "lucide-react";

export const StepVetSelection = () => {
  const { selectedSpecialty, setVet } = useStepperContext();
  const [veterinarios, setVeterinarios] = useState<VeterinarioDetallado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!selectedSpecialty) {
      setVeterinarios([]);
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    const cargarVeterinarios = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getVeterinarios(selectedSpecialty.id);
        if (active) {
          setVeterinarios(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los veterinarios.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void cargarVeterinarios();

    return () => {
      active = false;
    };
  }, [selectedSpecialty]);

  const seleccionarVeterinario = (veterinario: VeterinarioDetallado) => {
    const seleccionado: Veterinarian = {
      id: veterinario.id,
      name: veterinario.nombre,
      specialty:
        veterinario.especialidad_nombre ||
        selectedSpecialty?.name ||
        "Medicina General",
      averageRating: veterinario.average_rating ?? 0,
      photoUrl: veterinario.foto_url ?? null,
    };

    setVet(seleccionado);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-3.5 h-3.5 fill-amber-400/50 text-amber-400"
        />,
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d9488] mb-3" />
        <p className="text-sm font-medium">Cargando veterinarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">No se pudieron cargar los veterinarios</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Veterinarios de {selectedSpecialty?.name}
        </h2>
        <p className="text-sm text-slate-500">
          Selecciona al veterinario que atenderá a tu mascota
        </p>
      </div>

      {veterinarios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <User className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-500">
            No hay veterinarios disponibles para esta especialidad
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {veterinarios.map((vet) => {
            const rating = vet.average_rating ?? 0;

            return (
              <button
                key={vet.id}
                onClick={() => seleccionarVeterinario(vet)}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#0d9488] hover:bg-teal-50/50 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#0d9488]/10 flex items-center justify-center flex-shrink-0 overflow-hidden transition-colors relative">
                  {vet.foto_url ? (
                    <img
                      src={vet.foto_url}
                      alt={vet.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    style={{ display: vet.foto_url ? "none" : "flex" }}
                    className="w-full h-full items-center justify-center"
                  >
                    <User className="w-6 h-6 text-slate-400 group-hover:text-[#0d9488] transition-colors" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors">
                    {vet.nombre}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {vet.especialidad_nombre || selectedSpecialty?.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {renderStars(rating)}
                    <span className="text-xs font-medium text-slate-600 ml-1">
                      {rating > 0 ? rating : "Sin valoraciones"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
