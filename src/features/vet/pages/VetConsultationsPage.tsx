import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, PawPrint, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { vetScheduleService } from '../../appointments/services/vetScheduleService';
import type { CitaAgenda, EstadoCita } from '../../appointments/types/vetSchedule.types';

const ESTADO_BADGE: Record<EstadoCita, { texto: string; variant: 'healthy' | 'warning' | 'pending' | 'confirmed' }> = {
  atendida: { texto: 'Atendida', variant: 'healthy' },
  no_atendida: { texto: 'No Atendida', variant: 'warning' },
  pendiente: { texto: 'Pendiente', variant: 'pending' },
  cancelada: { texto: 'Cancelada', variant: 'warning' }
};

export const VetConsultationsPage: React.FC = () => {
  const { citaId } = useParams<{ citaId: string }>();
  const navigate = useNavigate();
  const [cita, setCita] = useState<CitaAgenda | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!citaId) {
      setCargando(false);
      return;
    }
    setCargando(true);
    vetScheduleService.getCitaById(citaId).then((data) => {
      setCita(data);
      setCargando(false);
    });
  }, [citaId]);

  if (!citaId) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Atenciones y Consultas Médicas</h1>
          <p className="text-sm text-slate-500">Selecciona una cita desde tu agenda diaria para ver su detalle</p>
        </div>

        <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Ninguna cita seleccionada</h3>
          <p className="text-xs text-slate-500 max-w-md">
            Ve a "Agenda Diaria" y haz clic sobre una cita para revisar su información.
          </p>
        </div>
      </div>
    );
  }

  if (cargando) {
    return <p className="text-center text-sm text-slate-400 py-12">Cargando cita...</p>;
  }

  if (!cita) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/veterinario/agenda')}
          className="flex items-center gap-2 text-sm font-semibold text-primary w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la agenda
        </button>
        <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
          <p className="text-sm text-slate-500">No se encontró la cita solicitada.</p>
        </div>
      </div>
    );
  }

  const badge = ESTADO_BADGE[cita.estado];
  const fecha = new Date(cita.fecha_hora).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const hora = new Date(cita.fecha_hora).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate('/veterinario/agenda')}
        className="flex items-center gap-2 text-sm font-semibold text-primary w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a la agenda
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Detalle de Cita</h1>
          <p className="text-sm text-slate-500">{fecha} · {hora}</p>
        </div>
        <Badge variant={badge.variant}>{badge.texto}</Badge>
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 p-6 grid gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-tertiary text-primary flex items-center justify-center shrink-0">
            <PawPrint className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Mascota</p>
            <p className="font-semibold text-slate-800">{cita.mascota.nombre}</p>
            <p className="text-sm text-slate-500">{cita.mascota.especie} · {cita.mascota.raza}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary-hover flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Propietario</p>
            <p className="font-semibold text-slate-800">{cita.propietario.nombre}</p>
            <p className="text-sm text-slate-500">{cita.propietario.telefono}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 sm:col-span-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Motivo de la consulta</p>
            <p className="text-sm text-slate-700">{cita.motivo}</p>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
          <Stethoscope className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Registro de Diagnóstico y Tratamiento</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Aquí se implementará el formulario de la US-22 y las acciones de la US-23 y US-24.
        </p>
      </div>
    </div>
  );
};