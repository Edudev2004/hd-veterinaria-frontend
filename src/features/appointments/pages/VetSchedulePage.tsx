import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  PawPrint,
  Stethoscope,
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { vetScheduleService } from '../services/vetScheduleService';
import type { CitaAgenda, EstadoCita } from '../types/vetSchedule.types';

const FILTROS = ['todas', 'pendientes', 'completadas'] as const;
type Filtro = (typeof FILTROS)[number];

const ESTADO_BADGE: Record<
  EstadoCita,
  { texto: string; variant: 'healthy' | 'warning' | 'pending' | 'confirmed' }
> = {
  atendida: { texto: 'Atendida', variant: 'healthy' },
  no_atendida: { texto: 'No atendida', variant: 'warning' },
  pendiente: { texto: 'Pendiente', variant: 'pending' },
  cancelada: { texto: 'Cancelada', variant: 'warning' }
};

const cumpleFiltro = (cita: CitaAgenda, filtro: Filtro): boolean => {
  if (filtro === 'todas') return true;
  if (filtro === 'pendientes') return cita.estado === 'pendiente';

  return cita.estado === 'atendida' || cita.estado === 'no_atendida';
};

export const VetSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [citas, setCitas] = useState<CitaAgenda[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [citaExpandidaId, setCitaExpandidaId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user) return;

    setCargando(true);

    vetScheduleService.getAgendaDiaria(user.id).then((data) => {
      setCitas(data);
      setCargando(false);
    });
  }, [user]);

  const citasFiltradas = citas.filter((cita) => cumpleFiltro(cita, filtro));
  const atendidas = citas.filter((cita) => cita.estado === 'atendida').length;
  const pendientes = citas.filter((cita) => cita.estado === 'pendiente').length;

  const hoy = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long'
  });

  const alternarDetalle = (citaId: string) => {
    setCitaExpandidaId((citaActual) =>
      citaActual === citaId ? null : citaId
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-slate-900">
            Agenda Diaria del Veterinario
          </h1>
          <p className="text-sm text-slate-500">
            Hoy, {hoy} · {citas.length} citas programadas
          </p>
        </div>

        <div className="flex gap-3">
          <div className="rounded-xl bg-tertiary px-4 py-2 text-center">
            <p className="text-xs text-slate-500">Atendidas</p>
            <p className="text-lg font-bold text-primary">{atendidas}</p>
          </div>

          <div className="rounded-xl bg-secondary/10 px-4 py-2 text-center">
            <p className="text-xs text-slate-500">Pendientes</p>
            <p className="text-lg font-bold text-secondary-hover">
              {pendientes}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4">
        <div className="mb-3 flex gap-2 border-b border-slate-100 pb-3">
          {FILTROS.map((clave) => (
            <button
              key={clave}
              onClick={() => setFiltro(clave)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition-colors ${
                filtro === clave
                  ? 'bg-tertiary text-primary'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {clave}
            </button>
          ))}
        </div>

        {cargando ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Cargando agenda...
          </p>
        ) : citasFiltradas.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No hay citas en esta categoría.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {citasFiltradas.map((cita) => {
              const hora = new Date(cita.fecha_hora).toLocaleTimeString(
                'es-PE',
                {
                  hour: '2-digit',
                  minute: '2-digit'
                }
              );

              const badge = ESTADO_BADGE[cita.estado];
              const detalleVisible = citaExpandidaId === cita.id;

              return (
                <li
                  key={cita.id}
                  className="overflow-hidden rounded-xl border border-slate-100 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-4 p-3">
                    <div className="flex w-16 flex-col items-center justify-center font-bold text-primary">
                      <Clock className="mb-1 h-4 w-4" />
                      <span className="text-sm">{hora}</span>
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        {cita.mascota.nombre}
                        <span className="text-xs font-normal text-slate-400">
                          {' '}
                          · {cita.mascota.especie} - {cita.mascota.raza}
                        </span>
                      </p>
                      <p className="text-sm text-slate-500">
                        {cita.propietario.nombre} · {cita.motivo}
                      </p>
                    </div>

                    <Badge variant={badge.variant}>{badge.texto}</Badge>

                    <button
                      onClick={() => alternarDetalle(cita.id)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-tertiary"
                      aria-expanded={detalleVisible}
                    >
                      {detalleVisible ? 'Ocultar' : 'Ver detalle'}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          detalleVisible ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {detalleVisible && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex gap-4 rounded-xl bg-white p-4">
                          {cita.mascota.fotoUrl ? (
                            <img
                              src={cita.mascota.fotoUrl}
                              alt={cita.mascota.nombre}
                              className="h-16 w-16 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-tertiary text-primary">
                              <PawPrint className="h-7 w-7" />
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Paciente
                            </p>
                            <p className="font-bold text-slate-800">
                              {cita.mascota.nombre}
                            </p>
                            <p className="text-sm text-slate-500">
                              {cita.mascota.especie} · {cita.mascota.raza} ·{' '}
                              {cita.mascota.edad}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 rounded-xl bg-white p-4">
                          {cita.propietario.fotoUrl ? (
                            <img
                              src={cita.propietario.fotoUrl}
                              alt={cita.propietario.nombre}
                              className="h-16 w-16 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary-hover">
                              <User className="h-7 w-7" />
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Propietario
                            </p>
                            <p className="font-bold text-slate-800">
                              {cita.propietario.nombre}
                            </p>
                            <p className="text-sm text-slate-500">
                              {cita.propietario.telefono}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl bg-white p-4">
                          <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <PawPrint className="h-4 w-4" />
                            Descripción de la mascota
                          </p>
                          <p className="text-sm text-slate-600">
                            {cita.mascota.descripcion}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-4">
                          <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <FileText className="h-4 w-4" />
                            Motivo de consulta
                          </p>
                          <p className="text-sm text-slate-600">
                            {cita.motivo}
                          </p>
                        </div>
                      </div>

                      {cita.estado === 'pendiente' && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() =>
                              navigate(`/veterinario/atenciones/${cita.id}`)
                            }
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                          >
                            <Stethoscope className="h-4 w-4" />
                            Iniciar atención
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {citas.length === 0 && !cargando && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Calendar className="h-6 w-6" />
          </div>
          <p className="max-w-md text-xs text-slate-500">
            No tienes citas programadas por el momento.
          </p>
        </div>
      )}
    </div>
  );
};