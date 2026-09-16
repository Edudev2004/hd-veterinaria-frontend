import React from 'react';
import { Calendar, Clock, PawPrint, User } from 'lucide-react';
import type { CitaAgenda } from '../../appointments/types/vetSchedule.types';

interface VetConsultationSummaryProps {
  cita: CitaAgenda;
}

export const VetConsultationSummary: React.FC<
  VetConsultationSummaryProps
> = ({ cita }) => {
  const fecha = new Date(cita.fecha_hora).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const hora = new Date(cita.fecha_hora).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Atención en curso
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-800">
          {cita.mascota.nombre}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          {cita.mascota.fotoUrl ? (
            <img
              src={cita.mascota.fotoUrl}
              alt={cita.mascota.nombre}
              className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary text-primary">
              <PawPrint className="h-6 w-6" />
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-slate-400">Paciente</p>
            <p className="font-semibold text-slate-800">
              {cita.mascota.nombre}
            </p>
            <p className="text-sm text-slate-500">
              {cita.mascota.especie} · {cita.mascota.raza}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {cita.propietario.fotoUrl ? (
            <img
              src={cita.propietario.fotoUrl}
              alt={cita.propietario.nombre}
              className="h-12 w-12 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary-hover">
              <User className="h-6 w-6" />
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-slate-400">Propietario</p>
            <p className="font-semibold text-slate-800">
              {cita.propietario.nombre}
            </p>
            <p className="text-sm text-slate-500">
              {cita.propietario.telefono}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="flex gap-2">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <p className="text-xs font-medium text-slate-400">Fecha</p>
            <p className="capitalize text-sm font-semibold text-slate-700">
              {fecha}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <p className="text-xs font-medium text-slate-400">Horario</p>
            <p className="text-sm font-semibold text-slate-700">{hora}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Motivo de consulta
        </p>
        <p className="mt-1 text-sm text-slate-700">{cita.motivo}</p>
      </div>
    </section>
  );
};