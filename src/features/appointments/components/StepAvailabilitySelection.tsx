import { useEffect, useMemo, useState } from "react";
import { useStepperContext } from "../context/AppointmentStepperContext";
import { CalendarDatePicker } from "./CalendarDatePicker";
import { TimeSlotsGrid } from "./TimeSlotsGrid";
import { getHorariosDisponibles } from "../../../services/citaService";
import type { AvailabilitySlot } from "../types/appointment.types";
import { AlertCircle, Loader2 } from "lucide-react";

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildAvailableDates = (days: number): string[] => {
  const today = new Date();
  const dates: string[] = [];

  for (let index = 0; index < days; index++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    dates.push(formatLocalDate(date));
  }

  return dates;
};

export const StepAvailabilitySelection = () => {
  const { selectedVet, selectedSlot, setSlot, clearSlot } = useStepperContext();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableDates = useMemo(() => buildAvailableDates(30), []);

  useEffect(() => {
    let active = true;

    if (!selectedVet || !selectedDate) {
      setSlots([]);
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    const cargarDisponibilidad = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const franjas = await getHorariosDisponibles(selectedVet.id, selectedDate);

        if (active) {
          setSlots(
            franjas.map((franja) => ({
              id: `${selectedVet.id}-${selectedDate}-${franja.hora}`,
              vetId: selectedVet.id,
              date: selectedDate,
              startTime: franja.hora,
              status: franja.disponible ? "available" : "occupied",
            })),
          );
        }
      } catch (err) {
        if (active) {
          setSlots([]);
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo consultar la disponibilidad.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void cargarDisponibilidad();

    return () => {
      active = false;
    };
  }, [selectedVet, selectedDate]);

  const handleDateSelect = (date: string) => {
    clearSlot();
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Selecciona un Horario
        </h2>
        <p className="text-sm text-slate-500">
          Elige la fecha y hora disponible para tu cita
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalendarDatePicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          availableDates={availableDates}
        />

        {selectedDate && (
          <div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-[#0d9488] mb-3" />
                <p className="text-sm font-medium">Consultando disponibilidad...</p>
              </div>
            ) : error ? (
              <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">No se pudo consultar la disponibilidad</p>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              </div>
            ) : (
              <TimeSlotsGrid
                slots={slots}
                selectedSlot={selectedSlot}
                onSlotSelect={setSlot}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
