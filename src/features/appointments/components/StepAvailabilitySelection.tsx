import { useState } from "react";
import { useStepperContext } from "../context/AppointmentStepperContext";
import { CalendarDatePicker } from "./CalendarDatePicker";
import { TimeSlotsGrid } from "./TimeSlotsGrid";
import availabilitySlots from "../mocks/availabilitySlots.json";
import type { AvailabilitySlot } from "../types/appointment.types";

const slots = availabilitySlots as AvailabilitySlot[];

export const StepAvailabilitySelection = () => {
  const { selectedVet, setSlot } = useStepperContext();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const vetSlots = slots.filter(
    (slot) => slot.vetId === selectedVet?.id,
  );

  const availableDates = [
    ...new Set(
      vetSlots
        .filter((slot) => slot.status === "available")
        .map((slot) => slot.date),
    ),
  ];

  const slotsForDate = vetSlots.filter(
    (slot) => slot.date === selectedDate,
  );

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
          onDateSelect={setSelectedDate}
          availableDates={availableDates}
        />

        {selectedDate && (
          <TimeSlotsGrid
            slots={slotsForDate}
            selectedSlot={null}
            onSlotSelect={setSlot}
          />
        )}
      </div>
    </div>
  );
};
