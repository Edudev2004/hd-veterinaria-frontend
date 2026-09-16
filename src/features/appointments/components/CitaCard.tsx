import React from 'react';
import { Calendar, Clock, Stethoscope, Edit3, ChevronRight, CalendarX, Eye } from 'lucide-react';
import { CitaDetallada } from '../../../types/cita.types';
import { CitaEstadoBadge } from './CitaEstadoBadge';

interface CitaCardProps {
  cita: CitaDetallada;
  onModificar: (cita: CitaDetallada) => void;
  onCancelar?: (cita: CitaDetallada) => void;
  onVerDetalle?: (cita: CitaDetallada) => void;
}

export const CitaCard: React.FC<CitaCardProps> = ({ cita, onModificar, onCancelar, onVerDetalle }) => {
  const estadoNormalizado = (cita.estado ? String(cita.estado).toLowerCase() : 'pendiente');
  const esModificable = estadoNormalizado === 'pendiente';
  const esCancelable = estadoNormalizado === 'pendiente' || estadoNormalizado === 'confirmada';

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

        <CitaEstadoBadge estado={cita.estado} motivo={cita.motivo} />
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
          <span className="font-semibold text-slate-700 block mb-1">
            {estadoNormalizado === 'cancelada' ? 'Motivo de cancelación / registro:' : 'Motivo:'}
          </span>
          <p
            className={`p-2.5 rounded-xl border line-clamp-2 italic ${
              estadoNormalizado === 'cancelada'
                ? 'bg-rose-50/60 border-rose-100 text-rose-900'
                : 'bg-slate-50/70 border-slate-100 text-slate-600'
            }`}
          >
            "{cita.motivo}"
          </p>
        </div>
      )}

      {/* Pie de Tarjeta y Botones de Acción */}
      <div className="pt-2 border-t border-slate-100/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono">
            ID: {cita.id.slice(0, 8)}
          </span>
          {onVerDetalle && (
            <button
              type="button"
              onClick={() => onVerDetalle(cita)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-teal-800 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl transition-all shadow-xs active:scale-95"
              title="Consultar detalle completo de la cita médica"
            >
              <Eye className="w-3.5 h-3.5 text-[#0d9488]" />
              <span>Detalle</span>
            </button>
          )}
        </div>

        {esModificable ? (
          <div className="flex items-center gap-2">
            {onCancelar && (
              <button
                type="button"
                onClick={() => onCancelar(cita)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl transition-all shadow-sm active:scale-95"
                title="Cancelar esta cita médica definitivamente"
              >
                <CalendarX className="w-3.5 h-3.5" />
                <span>Cancelar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onModificar(cita)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#0d9488] hover:text-white bg-teal-50 hover:bg-[#0d9488] border border-teal-200 hover:border-[#0d9488] rounded-xl transition-all shadow-sm active:scale-95"
              title="Reprogramar fecha, hora o cambiar motivo de la cita"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modificar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ) : esCancelable && onCancelar ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCancelar(cita)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl transition-all shadow-sm active:scale-95"
              title="Cancelar esta cita médica confirmada"
            >
              <CalendarX className="w-3.5 h-3.5" />
              <span>Cancelar</span>
            </button>
          </div>
        ) : (
          <span
            className="text-[11px] text-slate-400 italic px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100"
            title={
              estadoNormalizado === 'cancelada'
                ? 'Esta cita ya fue cancelada y no permite acciones'
                : `Las citas en estado '${cita.estado}' no permiten modificaciones ni cancelación`
            }
          >
            Sin acciones ({cita.estado})
          </span>
        )}
      </div>
    </div>
  );
};

