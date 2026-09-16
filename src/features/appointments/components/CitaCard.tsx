import React from 'react';
import { Calendar, Clock, Stethoscope, Edit3, ChevronRight } from 'lucide-react';
import { CitaDetallada } from '../../../types/cita.types';
import { CitaEstadoBadge } from './CitaEstadoBadge';

interface CitaCardProps {
  cita: CitaDetallada;
  onModificar: (cita: CitaDetallada) => void;
}

export const CitaCard: React.FC<CitaCardProps> = ({ cita, onModificar }) => {
  const esModificable = cita.estado === 'pendiente';

  // Formatear fecha y hora
  const { fechaTexto, horaTexto } = (() => {
    try {
      const d = new Date(cita.fecha_hora);
      const fechaTexto = d.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const horaTexto = d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return { fechaTexto, horaTexto };
    } catch {
      return { fechaTexto: cita.fecha_hora, horaTexto: '' };
    }
  })();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between gap-4">
      {/* Encabezado de la Tarjeta: Mascota y Estado */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {cita.mascota.foto_url ? (
            <img
              src={cita.mascota.foto_url}
              alt={cita.mascota.nombre}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-[#0d9488] font-bold text-lg flex items-center justify-center shadow-sm">
              {cita.mascota.nombre.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h4 className="text-base font-bold text-slate-900 leading-tight">
              {cita.mascota.nombre}
            </h4>
            <p className="text-xs text-slate-500 capitalize">
              {cita.mascota.especie} {cita.mascota.raza ? `• ${cita.mascota.raza}` : ''}
            </p>
          </div>
        </div>

        <CitaEstadoBadge estado={cita.estado} />
      </div>

      {/* Datos Clave: Fecha/Hora y Veterinario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-3 border-y border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
          <Calendar className="w-4 h-4 text-[#0d9488] shrink-0" />
          <div>
            <span className="font-semibold text-slate-800 capitalize block">{fechaTexto}</span>
            <span className="text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> {horaTexto}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
          <Stethoscope className="w-4 h-4 text-[#0d9488] shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-slate-800 truncate block">
              {cita.veterinario.nombre}
            </span>
            <span className="text-slate-500 text-[11px] truncate block">
              {cita.veterinario.especialidad_nombre}
            </span>
          </div>
        </div>
      </div>

      {/* Motivo de la Cita */}
      {cita.motivo && (
        <div className="text-xs text-slate-600">
          <span className="font-semibold text-slate-700 block mb-1">Motivo:</span>
          <p className="text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 line-clamp-2 italic">
            "{cita.motivo}"
          </p>
        </div>
      )}

      {/* Pie de Tarjeta y Botón de Modificación */}
      <div className="pt-1 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-400 font-mono">
          ID: {cita.id.slice(0, 8)}
        </div>

        {esModificable ? (
          <button
            type="button"
            onClick={() => onModificar(cita)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0d9488] hover:text-white bg-teal-50 hover:bg-[#0d9488] border border-teal-200 hover:border-[#0d9488] rounded-xl transition-all shadow-sm active:scale-95"
            title="Reprogramar fecha, hora o cambiar motivo de la cita"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modificar Cita</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        ) : (
          <span
            className="text-[11px] text-slate-400 italic px-2 py-1 rounded bg-slate-50 border border-slate-100"
            title="Solo las citas en estado 'pendiente' permiten modificación"
          >
            No modificable ({cita.estado})
          </span>
        )}
      </div>
    </div>
  );
};

