import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { getHorariosDisponibles } from '../../../services/citaService';
import { FranjaHorariaDisponible } from '../../../types/cita.types';

interface ModificarFechaHoraFieldProps {
  fechaHoraOriginal: string; // fecha/hora local de la cita antes de modificar
  veterinarioId: string;
  citaId: string;
  value: string; // fecha/hora local seleccionada (YYYY-MM-DDTHH:mm)
  onChange: (nuevoValor: string) => void;
  error?: string;
}

const parseLocalDateTime = (value: string): { fecha: string; hora: string } => {
  const match = value.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
  if (match) {
    return { fecha: match[1], hora: match[2] };
  }

  try {
    const dateObj = new Date(value);
    if (Number.isNaN(dateObj.getTime())) return { fecha: '', hora: '' };

    const fecha = [
      dateObj.getFullYear(),
      String(dateObj.getMonth() + 1).padStart(2, '0'),
      String(dateObj.getDate()).padStart(2, '0')
    ].join('-');
    const hora = [
      String(dateObj.getHours()).padStart(2, '0'),
      String(dateObj.getMinutes()).padStart(2, '0')
    ].join(':');

    return { fecha, hora };
  } catch {
    return { fecha: '', hora: '' };
  }
};

const formatLocalDate = (date: Date): string => {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
};

export const ModificarFechaHoraField: React.FC<ModificarFechaHoraFieldProps> = ({
  fechaHoraOriginal,
  veterinarioId,
  citaId,
  value,
  onChange,
  error
}) => {
  const initial = parseLocalDateTime(value || fechaHoraOriginal);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(initial.fecha);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>(initial.hora);
  const [franjas, setFranjas] = useState<FranjaHorariaDisponible[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState<string | null>(null);

  const hoyStr = formatLocalDate(new Date());
  const fechaHoraOriginalLocal = parseLocalDateTime(fechaHoraOriginal);

  // Cargar franjas disponibles desde el backend al cambiar de fecha o veterinario
  useEffect(() => {
    let active = true;

    if (!fechaSeleccionada || !veterinarioId) {
      setFranjas([]);
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    const cargarDisponibilidad = async () => {
      setIsLoading(true);
      setErrorDisponibilidad(null);

      try {
        const slots = await getHorariosDisponibles(veterinarioId, fechaSeleccionada);
        if (active) {
          setFranjas(slots);
        }
      } catch (err) {
        if (active) {
          setFranjas([]);
          setErrorDisponibilidad(
            err instanceof Error
              ? err.message
              : 'No se pudo consultar la disponibilidad.'
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
  }, [fechaSeleccionada, veterinarioId]);

  // Manejar cambio de fecha sin conversiones UTC
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value;
    setFechaSeleccionada(nuevaFecha);
    setHoraSeleccionada('');
    onChange('');
  };

  // Manejar selección de franja horaria sin conversiones UTC
  const handleSlotClick = (hora: string) => {
    setHoraSeleccionada(hora);

    if (fechaSeleccionada) {
      onChange(`${fechaSeleccionada}T${hora}:00`);
    }
  };

  // Formato legible de fecha original
  const fechaOriginalLegible = (() => {
    try {
      const d = new Date(fechaHoraOriginal);
      if (Number.isNaN(d.getTime())) return fechaHoraOriginal;

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

          {isLoading ? (
            <div className="flex items-center gap-2 py-4 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-[#0d9488]" />
              Consultando disponibilidad...
            </div>
          ) : errorDisponibilidad ? (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorDisponibilidad}</span>
            </div>
          ) : franjas.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">
              No hay horarios disponibles para esta fecha.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
              {franjas.map((slot) => {
                const isSelected = horaSeleccionada === slot.hora;
                const isCurrentAppointmentSlot =
                  fechaSeleccionada === fechaHoraOriginalLocal.fecha &&
                  slot.hora === fechaHoraOriginalLocal.hora;
                const estaDisponible = slot.disponible || isCurrentAppointmentSlot;

                return (
                  <button
                    key={`${citaId}-${slot.hora}`}
                    type="button"
                    disabled={!estaDisponible}
                    onClick={() => handleSlotClick(slot.hora)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border text-center relative ${
                      isSelected
                        ? 'bg-[#0d9488] text-white border-[#0d9488] shadow-sm'
                        : estaDisponible
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
          )}
        </div>
      )}

      {/* Mensaje de error de validación */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
