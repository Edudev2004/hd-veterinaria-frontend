import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  FileSpreadsheet,
  Loader2,
  PawPrint,
  RefreshCw,
  Stethoscope,
} from 'lucide-react';
import {
  descargarExcelCitas,
  descargarExcelMascotas,
  descargarExcelVeterinarios,
  getMascotasPorEspecie,
  getRankingVeterinarios,
  getReporteCitas,
  MascotasPorEspecie,
  ReporteCitas,
  VeterinarioRanking,
} from '@/services/adminReportApi';

// ---- Utilidades ----

const toIsoDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const primerDiaDelMes = (): string => {
  const hoy = new Date();
  return toIsoDate(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
};

const ultimoDiaDelMes = (): string => {
  const hoy = new Date();
  return toIsoDate(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0));
};

const mensajeDeError = (error: unknown): string =>
  error instanceof Error && error.message
    ? error.message
    : 'No se pudo cargar la información. Intenta nuevamente.';

const guardarArchivo = (archivo: Blob, nombreArchivo: string): void => {
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
};

const porcentaje = (parte: number, total: number): number => (total > 0 ? (parte / total) * 100 : 0);

const COLORES_ESTADO: Record<string, string> = {
  ATENDIDA: 'bg-green-500',
  PENDIENTE: 'bg-amber-400',
  CONFIRMADA: 'bg-blue-500',
  CANCELADA: 'bg-red-400',
  NO_ATENDIDA: 'bg-slate-400',
};

// ---- Componentes pequeños ----

const EstadoCarga: React.FC = () => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
    <Loader2 className="h-4 w-4 animate-spin" />
    Cargando...
  </div>
);

const EstadoError: React.FC<{ mensaje: string; onRetry: () => void }> = ({ mensaje, onRetry }) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-6 text-center">
    <div className="flex items-center gap-2 text-sm text-red-700">
      <AlertCircle className="h-4 w-4" />
      {mensaje}
    </div>
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
    >
      <RefreshCw className="h-3 w-3" />
      Reintentar
    </button>
  </div>
);

const EstadoVacio: React.FC<{ mensaje: string }> = ({ mensaje }) => (
  <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
    <p className="text-sm text-slate-500">{mensaje}</p>
  </div>
);

// ---- Página ----

export const AdminReportsPage: React.FC = () => {
  const [startDate, setStartDate] = useState(primerDiaDelMes);
  const [endDate, setEndDate] = useState(ultimoDiaDelMes);

  const [reporteCitas, setReporteCitas] = useState<ReporteCitas | null>(null);
  const [cargandoCitas, setCargandoCitas] = useState(true);
  const [errorCitas, setErrorCitas] = useState<string | null>(null);

  const [ranking, setRanking] = useState<VeterinarioRanking[]>([]);
  const [especies, setEspecies] = useState<MascotasPorEspecie[]>([]);
  const [cargandoGenerales, setCargandoGenerales] = useState(true);
  const [errorGenerales, setErrorGenerales] = useState<string | null>(null);

  const [descargando, setDescargando] = useState<'citas' | 'veterinarios' | 'especies' | null>(null);
  const [errorDescarga, setErrorDescarga] = useState<string | null>(null);

  const rangoInvalido = Boolean(startDate && endDate && startDate > endDate);
  const rangoIncompleto = !startDate || !endDate;

  const cargarCitas = useCallback(async () => {
    if (rangoInvalido || rangoIncompleto) return;
    setCargandoCitas(true);
    setErrorCitas(null);
    try {
      setReporteCitas(await getReporteCitas(startDate, endDate));
    } catch (error) {
      setErrorCitas(mensajeDeError(error));
    } finally {
      setCargandoCitas(false);
    }
  }, [startDate, endDate, rangoInvalido, rangoIncompleto]);

  const cargarGenerales = useCallback(async () => {
    setCargandoGenerales(true);
    setErrorGenerales(null);
    try {
      const [rankingData, especiesData] = await Promise.all([
        getRankingVeterinarios(),
        getMascotasPorEspecie(),
      ]);
      setRanking(rankingData);
      setEspecies(especiesData);
    } catch (error) {
      setErrorGenerales(mensajeDeError(error));
    } finally {
      setCargandoGenerales(false);
    }
  }, []);

  useEffect(() => {
    void cargarCitas();
  }, [cargarCitas]);

  useEffect(() => {
    void cargarGenerales();
  }, [cargarGenerales]);

  const totalMascotas = especies.reduce((sum, item) => sum + item.cantidad, 0);
  const maxAtenciones = Math.max(1, ...ranking.map((vet) => vet.atenciones));
  const contarEstado = (estado: string) =>
    reporteCitas?.porEstado.find((item) => item.estado === estado)?.cantidad ?? 0;

  // ---- Exportación oficial a Excel (.xlsx) generada por backend con Apache POI ----

  const exportCitas = async () => {
    if (!startDate || !endDate || rangoInvalido) return;
    try {
      setDescargando('citas');
      setErrorDescarga(null);
      const blob = await descargarExcelCitas(startDate, endDate);
      guardarArchivo(blob, `reporte_citas_${startDate}_${endDate}.xlsx`);
    } catch (e) {
      console.error('Error al descargar reporte de citas en Excel:', e);
      setErrorDescarga('No se pudo generar el reporte de citas en formato Excel.');
    } finally {
      setDescargando(null);
    }
  };

  const exportVeterinarios = async () => {
    try {
      setDescargando('veterinarios');
      setErrorDescarga(null);
      const blob = await descargarExcelVeterinarios();
      const fecha = toIsoDate(new Date());
      guardarArchivo(blob, `ranking_veterinarios_${fecha}.xlsx`);
    } catch (e) {
      console.error('Error al descargar reporte de veterinarios en Excel:', e);
      setErrorDescarga('No se pudo generar el reporte de veterinarios en formato Excel.');
    } finally {
      setDescargando(null);
    }
  };

  const exportEspecies = async () => {
    try {
      setDescargando('especies');
      setErrorDescarga(null);
      const blob = await descargarExcelMascotas();
      const fecha = toIsoDate(new Date());
      guardarArchivo(blob, `reporte_mascotas_especies_${fecha}.xlsx`);
    } catch (e) {
      console.error('Error al descargar reporte de especies en Excel:', e);
      setErrorDescarga('No se pudo generar el reporte de especies en formato Excel.');
    } finally {
      setDescargando(null);
    }
  };

  const tarjetas = [
    {
      titulo: 'Citas del período',
      valor: reporteCitas?.total,
      detalle: 'Total registradas',
      icono: <CalendarDays size={24} />,
    },
    {
      titulo: 'Citas atendidas',
      valor: reporteCitas ? contarEstado('ATENDIDA') : undefined,
      detalle: 'En el período seleccionado',
      icono: <Stethoscope size={24} />,
    },
    {
      titulo: 'Citas canceladas',
      valor: reporteCitas ? contarEstado('CANCELADA') : undefined,
      detalle: 'En el período seleccionado',
      icono: <BarChart3 size={24} />,
    },
    {
      titulo: 'Mascotas activas',
      valor: cargandoGenerales || errorGenerales ? undefined : totalMascotas,
      detalle: 'Registradas en el sistema',
      icono: <PawPrint size={24} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reportes y Estadísticas</h1>
        <p className="mt-1 text-sm text-slate-500">
          Información estadística consolidada y reportes del sistema en tiempo real.
        </p>
      </div>

      {/* Filtro por período */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">Filtro por período</h2>
          <p className="mt-1 text-sm text-slate-500">
            Selecciona el período que deseas consultar en el reporte de citas.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-end">
          <div>
            <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-slate-700">
              Fecha de inicio
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="mb-2 block text-sm font-medium text-slate-700">
              Fecha de fin
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-slate-400"
            />
          </div>
        </div>

        {rangoInvalido && (
          <p className="mt-3 text-sm text-red-600">
            La fecha de inicio no puede ser posterior a la fecha de fin.
          </p>
        )}
        {rangoIncompleto && (
          <p className="mt-3 text-sm text-amber-600">Selecciona ambas fechas para ver el reporte.</p>
        )}
      </div>

      {/* Tarjetas resumen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tarjetas.map((tarjeta) => (
          <div key={tarjeta.titulo} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              {tarjeta.icono}
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{tarjeta.titulo}</p>
            <p className="mt-1 text-3xl font-bold text-slate-800">{tarjeta.valor ?? '—'}</p>
            <p className="mt-1 text-xs text-slate-400">{tarjeta.detalle}</p>
          </div>
        ))}
      </div>

      {/* Citas por estado */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-lg font-bold text-slate-800">Citas por período</h2>
          <p className="text-sm text-slate-500">
            Citas registradas entre {startDate || '—'} y {endDate || '—'}, agrupadas por estado.
          </p>
        </div>

        {rangoInvalido || rangoIncompleto ? (
          <EstadoVacio mensaje="Corrige el período seleccionado para consultar el reporte." />
        ) : cargandoCitas ? (
          <EstadoCarga />
        ) : errorCitas ? (
          <EstadoError mensaje={errorCitas} onRetry={cargarCitas} />
        ) : !reporteCitas || reporteCitas.total === 0 ? (
          <EstadoVacio mensaje="No se encontraron citas para el período seleccionado." />
        ) : (
          <div className="flex flex-col gap-5">
            {reporteCitas.porEstado.map((item) => {
              const pct = porcentaje(item.cantidad, reporteCitas.total);
              return (
                <div key={item.estado}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{item.etiqueta}</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {item.cantidad} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${COLORES_ESTADO[item.estado] ?? 'bg-slate-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-sm font-medium text-slate-700">
              Total de citas: {reporteCitas.total}
            </p>
          </div>
        )}
      </div>

      {/* Ranking de veterinarios + Mascotas por especie */}
      {cargandoGenerales ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <EstadoCarga />
        </div>
      ) : errorGenerales ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <EstadoError mensaje={errorGenerales} onRetry={cargarGenerales} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800">Veterinarios más solicitados</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ranking según la cantidad de citas atendidas (histórico).
              </p>
            </div>

            {ranking.length === 0 ? (
              <EstadoVacio mensaje="Aún no hay citas atendidas para generar el ranking." />
            ) : (
              <div className="flex flex-col gap-4">
                {ranking.map((vet, index) => (
                  <div key={vet.id}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-slate-800">
                        <span className="mr-2 font-semibold text-slate-500">#{index + 1}</span>
                        {vet.nombre}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-800">
                        {vet.atenciones} {vet.atenciones === 1 ? 'atención' : 'atenciones'}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${(vet.atenciones / maxAtenciones) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800">Mascotas por especie</h2>
              <p className="mt-1 text-sm text-slate-500">
                Distribución de mascotas activas registradas en el sistema.
              </p>
            </div>

            {especies.length === 0 ? (
              <EstadoVacio mensaje="Aún no hay mascotas registradas." />
            ) : (
              <div className="flex flex-col gap-5">
                {especies.map((item) => {
                  const pct = porcentaje(item.cantidad, totalMascotas);
                  return (
                    <div key={item.especie}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{item.especie}</span>
                        <span className="text-sm font-semibold text-slate-800">
                          {item.cantidad} ({pct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exportación */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Exportar reportes a Excel</h2>
            <p className="text-sm text-slate-500">
              Descarga los reportes consolidados en formato oficial Microsoft Excel (.xlsx).
            </p>
          </div>
        </div>

        {errorDescarga && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorDescarga}</span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={exportCitas}
            disabled={!reporteCitas || cargandoCitas || Boolean(errorCitas) || rangoInvalido || descargando !== null}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              {descargando === 'citas' ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              )}
              <p className="font-semibold text-slate-800">
                {descargando === 'citas' ? 'Generando Excel...' : 'Exportar citas (.xlsx)'}
              </p>
            </div>
            <p className="mt-1 text-xs text-slate-500">Detalle registro por registro y resumen estadístico.</p>
          </button>

          <button
            type="button"
            onClick={exportVeterinarios}
            disabled={cargandoGenerales || Boolean(errorGenerales) || ranking.length === 0 || descargando !== null}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              {descargando === 'veterinarios' ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              )}
              <p className="font-semibold text-slate-800">
                {descargando === 'veterinarios' ? 'Generando Excel...' : 'Exportar veterinarios (.xlsx)'}
              </p>
            </div>
            <p className="mt-1 text-xs text-slate-500">Padrón médico, especialidades y ranking de atenciones.</p>
          </button>

          <button
            type="button"
            onClick={exportEspecies}
            disabled={cargandoGenerales || Boolean(errorGenerales) || especies.length === 0 || descargando !== null}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              {descargando === 'especies' ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              )}
              <p className="font-semibold text-slate-800">
                {descargando === 'especies' ? 'Generando Excel...' : 'Exportar especies (.xlsx)'}
              </p>
            </div>
            <p className="mt-1 text-xs text-slate-500">Demografía por especie y padrón de pacientes.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
