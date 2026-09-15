import { Clock, XCircle } from "lucide-react";
import type { AvailabilitySlot } from "../types/appointment.types";

interface TimeSlotsGridProps {
  slots: AvailabilitySlot[];
  selectedSlot: AvailabilitySlot | null;
  onSlotSelect: (slot: AvailabilitySlot) => void;
}

const formatTimeRange = (startTime: string): string => {
  const [h] = startTime.split(":");
  const hour = parseInt(h, 10);
  const endHour = hour + 1;
  return `${startTime} - ${String(endHour).padStart(2, "0")}:00`;
};

export const TimeSlotsGrid = ({
  slots,
  selectedSlot,
  onSlotSelect,
}: TimeSlotsGridProps) => {
  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <XCircle className="w-10 h-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">
          No hay horarios disponibles para esta fecha
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Horarios Disponibles
          </h3>
          <p className="text-xs text-slate-500">Selecciona un horario libre</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border border-[#0d9488] bg-teal-50" />
            <span className="text-xs text-slate-500">Libre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-200" />
            <span className="text-xs text-slate-500">Ocupado</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const isOccupied = slot.status === "occupied";

          return (
            <button
              key={slot.id}
              onClick={() => !isOccupied && onSlotSelect(slot)}
              disabled={isOccupied}
              className={`
                flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium border transition-all
                ${
                  isSelected
                    ? "bg-[#0d9488] text-white border-[#0d9488] shadow-md"
                    : isOccupied
                      ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                      : "bg-white text-slate-700 border-slate-200 hover:border-[#0d9488] hover:bg-teal-50 cursor-pointer"
                }
              `}
            >
              {isOccupied ? (
                <XCircle className="w-4 h-4 text-slate-400" />
              ) : (
                <Clock
                  className={`w-4 h-4 ${isSelected ? "text-white" : "text-[#0d9488]"}`}
                />
              )}
              <span>{formatTimeRange(slot.startTime)}</span>
              {isOccupied && (
                <span className="text-[10px] text-slate-400 ml-1">Ocupado</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
