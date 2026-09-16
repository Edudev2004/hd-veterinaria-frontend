import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  PawPrint,
  Stethoscope,
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { vetScheduleService } from '../../appointments/services/vetScheduleService';
import type { CitaAgenda, EstadoCita } from '../../appointments/types/vetSchedule.types';

const ESTADO_BADGE: Record<
  EstadoCita,
  { texto: string; variant: 'healthy' | 'warning' | 'pending' | 'confirmed' }
> = {
  atendida: { texto: 'Atendida', variant: 'healthy' },
  no_atendida: { texto: 'No atendida', variant: 'warning' },
  pendiente: { texto: 'Pendiente', variant: 'pending' },
  cancelada: { texto: 'Cancelada', variant: 'warning' }
};

export const VetConsultationsPage: React.FC = () => {
  const { citaId } = useParams<{ citaId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cita, setCita] = useState<CitaAgenda | null>(null);
  const [citasPendientes, setCitasPendientes] = useState<CitaAgenda[]>([]);
  const [cargando, setCargando] = useState(true);

  const veterinarioId = user?.id;

  useEffect(() => {
    if (!veterinarioId) {
      setCargando(false);
      return;
    }

    setCargando(true);

    if (citaId) {
      vetScheduleService.getCitaById(citaId, veterinarioId).then((data) => {
        setCita(data);
        setCargando(false);
      });

      return;
    }

    vetScheduleService.getAgendaDiaria(veterinarioId).then((data) => {
      setCitasPendientes(
        data.filter((citaAgenda) => citaAgenda.estado === 'pendiente')
      );
      setCargando(false);
    });
  }, [citaId, veterinarioId]);

  if (!citaId) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-outfit text-2xl font-bold text-slate-900">
            Atenciones Médicas
          </h1>
          <p className="text-sm text-slate-500">
            Citas pendientes que requieren atención veterinaria.
          </p>
        </div>

        {cargando ? (
          <p className="py-12 text-center text-sm text-slate-400">
            Cargando atenciones pendientes...
          </p>
        ) : citasPendientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No hay atenciones pendientes
            </h3>
            <p className="max-w-md text-xs text-slate-500">
              Todas las citas de tu agenda diaria ya fueron atendidas o no tienes
              citas programadas.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {citasPendientes.map((citaPendiente) => {
              const hora = new Date(
                citaPendiente.fecha_hora
              ).toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <button
                  key={citaPendiente.id}
                  onClick={() =>
                    navigate(`/veterinario/atenciones/${citaPendiente.id}`)
                  }
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-primary/40"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-tertiary text-primary">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-bold">{hora}</span>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {citaPendiente.mascota.nombre}
                    </p>
                    <p className="text-sm text-slate-500">
                      {citaPendiente.mascota.especie} ·{' '}
                      {citaPendiente.mascota.raza}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Propietario: {citaPendiente.propietario.nombre}
                    </p>
                  </div>

                  <Badge variant="pending">Atender</Badge>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (cargando) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        Cargando detalle de la cita...
      </p>
    );
  }

  if (!cita) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/veterinario/atenciones')}
          className="flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a atenciones
        </button>

        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            No se encontró la cita solicitada o no pertenece a tu agenda.
          </p>
        </div>
      </div>
    );
  }

  const badge = ESTADO_BADGE[cita.estado];

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
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate('/veterinario/atenciones')}
        className="flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a atenciones
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-outfit text-2xl font-bold text-slate-900">
            Detalle de la Atención Médica
          </h1>
          <p className="capitalize text-sm text-slate-500">
            {fecha} · {hora}
          </p>
        </div>

        <Badge variant={badge.variant}>{badge.texto}</Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {cita.mascota.fotoUrl ? (
  <img
    src={cita.mascota.fotoUrl}
    alt={cita.mascota.nombre}
    className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 object-cover"
  />
) : (
  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-tertiary text-primary">
    <PawPrint className="h-8 w-8" />
  </div>
)}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Paciente
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              {cita.mascota.nombre}
            </h3>
            <p className="text-sm text-slate-500">
              {cita.mascota.especie} · {cita.mascota.raza}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {cita.propietario.fotoUrl ? (
  <img
    src={cita.propietario.fotoUrl}
    alt={cita.propietario.nombre}
    className="h-16 w-16 shrink-0 rounded-full border border-slate-200 object-cover"
  />
) : (
  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary-hover">
    <User className="h-8 w-8" />
  </div>
)}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Propietario
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              {cita.propietario.nombre}
            </h3>
            <p className="text-sm text-slate-500">
              Teléfono: {cita.propietario.telefono}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
          <FileText className="h-4 w-4" />
          Información de la cita
        </h4>

        <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs font-medium text-slate-400">Fecha y horario</p>
              <p className="text-sm font-semibold text-slate-700">
                {fecha} · {hora}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs font-medium text-slate-400">
                Motivo de consulta
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {cita.motivo}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Stethoscope className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Registro de Diagnóstico y Tratamiento
        </h3>
        <p className="max-w-md text-xs text-slate-500">
          Aquí se implementará el formulario de la US-22 y las acciones de la
          US-23 y US-24.
        </p>
      </div>
    </div>
  );
};