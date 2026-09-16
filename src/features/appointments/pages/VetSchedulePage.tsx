
import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { vetScheduleService } from '../services/vetScheduleService';
import type { CitaAgenda, EstadoCita } from '../types/vetSchedule.types';

const FILTROS = ['todas', 'pendientes', 'completadas'] as const;
type Filtro = (typeof FILTROS)[number];

const ESTADO_BADGE: Record<EstadoCita, { texto: string; variant: 'healthy' | 'warning' | 'pending' | 'confirmed' }> = {
  atendida: { texto: 'Atendida', variant: 'healthy' },
  no_atendida: { texto: 'No Atendida', variant: 'warning' },
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
  const [citas, setCitas] = useState<CitaAgenda[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user) return;
    setCargando(true);
    vetScheduleService.getAgendaDiaria(user.id).then((data) => {
      setCitas(data);
      setCargando(false);
    });
  }, [user]);

  const citasFiltradas = citas.filter((c) => cumpleFiltro(c, filtro));
  const atendidas = citas.filter((c) => c.estado === 'atendida').length;
  const pendientes = citas.filter((c) => c.estado === 'pendiente').length;

  const hoy = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long' });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-headline">Agenda Diaria del Veterinario</h1>
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
            <p className="text-lg font-bold text-secondary-hover">{pendientes}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 p-4">
        <div className="flex gap-2 border-b border-slate-100 pb-3 mb-3">
          {FILTROS.map((clave) => (
            <button
              key={clave}
              onClick={() => setFiltro(clave)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${
                filtro === clave ? 'bg-tertiary text-primary' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {clave}
            </button>
          ))}
        </div>

        {cargando ? (
          <p className="text-center text-sm text-slate-400 py-8">Cargando agenda...</p>
        ) : citasFiltradas.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">No hay citas en esta categoría.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {citasFiltradas.map((cita) => {
              const hora = new Date(cita.fecha_hora).toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit'
              });
              const badge = ESTADO_BADGE[cita.estado];
              return (
                <li
                  key={cita.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center w-16 text-primary font-bold">
                    <Clock className="w-4 h-4 mb-1" />
                    <span className="text-sm">{hora}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {cita.mascota.nombre}{' '}
                      <span className="text-xs font-normal text-slate-400">
                        · {cita.mascota.especie} - {cita.mascota.raza}
                      </span>
                    </p>
                    <p className="text-sm text-slate-500">
                      {cita.propietario.nombre} · {cita.motivo}
                    </p>
                  </div>
                  <Badge variant={badge.variant}>{badge.texto}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {citas.length === 0 && !cargando && (
        <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-500 max-w-md">No tienes citas programadas por el momento.</p>
        </div>
      )}
    </div>
  );
};