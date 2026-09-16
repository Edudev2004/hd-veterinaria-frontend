import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { getHorariosDisponibles } from '../../../services/citaService';
import { FranjaHorariaDisponible } from '../../../types/cita.types';

interface ModificarFechaHoraFieldProps {
  fechaHoraOriginal: string; // timestamptz ISO de la cita antes de modificar
  veterinarioId: string;
  citaId: string;
  value: string; // ISO actual seleccionado
  onChange: (nuevoIso: string) => void;
  error?: string;
}

export const ModificarFechaHoraField: React.FC<ModificarFechaHoraFieldProps> = ({
  fechaHoraOriginal,
  veterinarioId,
  citaId,
  value,
  onChange,
  error
}) => {
  // Extraer fecha (YYYY-MM-DD) y hora (HH:mm) del value inicial
  const parseIso = (iso: string) => {
    try {
      const dateObj = new Date(iso);
      if (isNaN(dateObj.getTime())) return { fecha: '', hora: '' };
      const fecha = dateObj.toISOString().split('T')[0];
      const hora = dateObj.toTimeString().slice(0, 5);
      return { fecha, hora };
    } catch {
      return { fecha: '', hora: '' };
    }
  };

  const initial = parseIso(value || fechaHoraOriginal);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(initial.fecha);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>(initial.hora);
  const [franjas, setFranjas] = useState<FranjaHorariaDisponible[]>([]);

  // Fecha mínima permitida: Hoy en formato YYYY-MM-DD
  const hoyStr = new Date().toISOString().split('T')[0];

  // Cargar franjas disponibles al cambiar de fecha o veterinario
  useEffect(() => {
    if (fechaSeleccionada && veterinarioId) {
      const slots = getHorariosDisponibles(veterinarioId, fechaSeleccionada, citaId);
      setFranjas(slots);
    }
  }, [fechaSeleccionada, veterinarioId, citaId]);

  // Manejar cambio de fecha
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value;
    setFechaSeleccionada(nuevaFecha);
    if (nuevaFecha && horaSeleccionada) {
      const nuevoIso = new Date(`${nuevaFecha}T${horaSeleccionada}:00`).toISOString();
      onChange(nuevoIso);
    }
  };

  // Manejar selección de franja horaria
  const handleSlotClick = (hora: string) => {
    setHoraSeleccionada(hora);
    if (fechaSeleccionada) {
      const nuevoIso = new Date(`${fechaSeleccionada}T${hora}:00`).toISOString();
      onChange(nuevoIso);
    }
  };

  // Formato legible de fecha original
  const fechaOriginalLegible = (() => {
    try {
      const d = new Date(fechaHoraOriginal);
      return d.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaHoraOriginal;
    }
  })();

  return (
    <div className="space-y-4">
      {/* Indicador de horario previo */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-slate-800">Horario programado actualmente:</span>
          <p className="capitalize mt-0.5 text-slate-700">{fechaOriginalLegible}</p>
        </div>
      </div>

      {/* Selector de nueva fecha */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#0d9488]" />
          Nueva Fecha de la Cita
        </label>
        <input
          type="date"
          min={hoyStr}
          value={fechaSeleccionada}
          onChange={handleDateChange}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#0d9488]/20 ${
            error ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500' : 'border-slate-200 bg-white text-slate-800 focus:border-[#0d9488]'
          }`}
        />
      </div>

      {/* Grid de franjas horarias */}
      {fechaSeleccionada && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#0d9488]" />
            Selecciona la Nueva Hora
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
            {franjas.map((slot) => {
              const isSelected = horaSeleccionada === slot.hora;
              const isCurrentAppointmentSlot =
                fechaSeleccionada === parseIso(fechaHoraOriginal).fecha &&
                slot.hora === parseIso(fechaHoraOriginal).hora;

              return (
                <button
                  key={slot.hora}
                  type="button"
                  disabled={!slot.disponible}
                  onClick={() => handleSlotClick(slot.hora)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border text-center relative ${
                    isSelected
                      ? 'bg-[#0d9488] text-white border-[#0d9488] shadow-sm'
                      : slot.disponible
                      ? 'bg-white hover:bg-teal-50/50 hover:border-teal-300 text-slate-700 border-slate-200'
                      : 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                  }`}
                >
                  {slot.hora}
                  {isCurrentAppointmentSlot && (
                    <span className="block text-[9px] font-normal text-amber-600">Actual</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mensaje de error si la validación falla */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

