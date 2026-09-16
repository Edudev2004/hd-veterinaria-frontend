// src/features/vet/pages/VetReviewsPage.tsx
// US-25: Ver mis valoraciones — veterinario
import React, { useEffect, useMemo, useState } from 'react';
import { Star, Award, MessageSquare } from 'lucide-react';
import { vetReviewsService } from '../services/vetReviewsService';
import type { ValoracionVeterinario } from '../types/valoracion.types';

const Estrellas: React.FC<{ puntuacion: number; tamaño?: string }> = ({ puntuacion, tamaño = 'w-4 h-4' }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`${tamaño} ${n <= puntuacion ? 'fill-secondary text-secondary' : 'text-slate-200'}`}
      />
    ))}
  </div>
);

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

const inicialesDe = (nombre: string) =>
  nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

type FiltroEstrellas = 'todas' | 5 | 4 | 3 | 2 | 1;

export const VetReviewsPage: React.FC = () => {
  const [valoraciones, setValoraciones] = useState<ValoracionVeterinario[]>([]);
  const [promedio, setPromedio] = useState(0);
  const [filtro, setFiltro] = useState<FiltroEstrellas>('todas');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([vetReviewsService.getMisValoraciones(), vetReviewsService.getPromedioValoraciones()]).then(
      ([lista, prom]) => {
        setValoraciones(lista);
        setPromedio(prom);
        setCargando(false);
      }
    );
  }, []);

  const distribucion = useMemo(() => {
    const conteo: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    valoraciones.forEach((v) => {
      conteo[v.puntuacion] = (conteo[v.puntuacion] ?? 0) + 1;
    });
    return conteo;
  }, [valoraciones]);

  const total = valoraciones.length;
  const valoracionesFiltradas =
    filtro === 'todas' ? valoraciones : valoraciones.filter((v) => v.puntuacion === filtro);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-headline">Mis Valoraciones Médico</h1>
        <p className="text-sm text-slate-500">Reseñas y puntuaciones dejadas por tus pacientes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 rounded-2xl bg-white border border-slate-100 p-6">
        <div className="flex flex-col items-center justify-center gap-2 md:border-r md:border-slate-100 md:pr-6">
          <div className="w-16 h-16 rounded-full bg-tertiary flex items-center justify-center text-primary">
            <Award className="w-8 h-8" />
          </div>
          <p className="text-4xl font-bold text-slate-900">{promedio || '—'}</p>
          <Estrellas puntuacion={Math.round(promedio)} tamaño="w-4 h-4" />
          <p className="text-xs text-slate-400">{total} valoraciones en total</p>
        </div>

        <div className="flex flex-col justify-center gap-2">
          {[5, 4, 3, 2, 1].map((estrella) => {
            const cantidad = distribucion[estrella] ?? 0;
            const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;
            return (
              <button
                key={estrella}
                onClick={() => setFiltro(filtro === estrella ? 'todas' : (estrella as FiltroEstrellas))}
                className={`flex items-center gap-2 text-left rounded-lg px-2 py-1 transition-colors ${
                  filtro === estrella ? 'bg-tertiary' : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-semibold text-slate-600 w-3">{estrella}</span>
                <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: `${porcentaje}%` }} />
                </div>
                <span className="text-xs text-slate-400 w-6 text-right">{cantidad}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filtro !== 'todas' && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          Mostrando solo valoraciones de {filtro} estrella{filtro !== 1 ? 's' : ''}
          <button onClick={() => setFiltro('todas')} className="text-primary font-semibold hover:underline">
            Ver todas
          </button>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-100 p-4">
        {cargando ? (
          <p className="text-center text-sm text-slate-400 py-8">Cargando valoraciones...</p>
        ) : valoracionesFiltradas.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
            <MessageSquare className="w-8 h-8" />
            <p className="text-sm">No hay valoraciones en esta categoría.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {valoracionesFiltradas.map((v) => (
              <li key={v.id} className="flex gap-3 rounded-xl border border-slate-100 p-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                  {inicialesDe(v.propietarioNombre)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <p className="font-semibold text-slate-800 text-sm">
                      {v.mascotaNombre} <span className="text-slate-400 font-normal">· {v.propietarioNombre}</span>
                    </p>
                    <span className="text-xs text-slate-400">{formatearFecha(v.created_at)}</span>
                  </div>
                  <Estrellas puntuacion={v.puntuacion} />
                  <p className="text-sm text-slate-600 mt-1">{v.comentario}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
