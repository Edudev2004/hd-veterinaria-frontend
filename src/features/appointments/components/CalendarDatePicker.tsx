import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface CalendarDatePickerProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  availableDates: string[];
}

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const formatDate = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

const isToday = (year: number, month: number, day: number): boolean => {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
};

export const CalendarDatePicker = ({
  selectedDate,
  onDateSelect,
  availableDates,
}: CalendarDatePickerProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const isAvailable = availableDates.includes(dateStr);
    const isSelected = selectedDate === dateStr;
    const isTodayFlag = isToday(currentYear, currentMonth, day);
    const isPastDate = dateStr < todayStr;

    days.push(
      <button
        key={day}
        onClick={() => isAvailable && !isPastDate && onDateSelect(dateStr)}
        disabled={!isAvailable || isPastDate}
        className={`
          relative h-10 w-full rounded-xl text-sm font-medium transition-all
          ${
            isSelected
              ? "bg-[#0d9488] text-white shadow-md ring-2 ring-teal-200"
              : isTodayFlag
                ? "bg-amber-50 text-amber-700 font-bold ring-1 ring-amber-200"
                : isAvailable && !isPastDate
                  ? "text-slate-700 hover:bg-teal-50 hover:text-[#0d9488] cursor-pointer"
                  : "text-slate-300 cursor-not-allowed"
          }
        `}
      >
        {day}
        {isAvailable && !isPastDate && !isSelected && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0d9488]/60" />
        )}
      </button>,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Selecciona una Fecha
        </h2>
        <p className="text-sm text-slate-500">
          Elige un día con disponibilidad para tu cita
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        {/* Header: Month + Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#0d9488]" />
            <span className="text-base font-bold text-slate-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
          </div>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-semibold text-slate-400 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">{days}</div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0d9488]/60" />
            <span className="text-xs text-slate-500">Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-amber-50 ring-1 ring-amber-200" />
            <span className="text-xs text-slate-500">Hoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-slate-100" />
            <span className="text-xs text-slate-500">Sin disponibilidad</span>
          </div>
        </div>
      </div>
    </div>
  );
};
