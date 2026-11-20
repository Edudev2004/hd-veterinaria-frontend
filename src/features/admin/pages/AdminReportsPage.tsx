import React, { useCallback, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
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
  etiquetaEspecie,
  etiquetaEstado,
  getMascotasPorEspecie,
  getRankingVeterinarios,
  getReporteCitas,
  MascotasPorEspecie,
  ReporteCitas,
  VeterinarioRanking,
} from '@/services/adminReportApi';
import { getCitas } from '@/services/citaService';
import { adminVeterinarianService } from '../services/adminVeterinarianService';

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

const formatFechaLegible = (isoDate?: string): string => {
  if (!isoDate) return '-';
  try {
    const parts = isoDate.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch {}
  return isoDate;
};

const formatHoraLegible = (isoDate?: string): string => {
  if (!isoDate) return '-';
  try {
    if (isoDate.includes('T')) {
      return isoDate.split('T')[1].substring(0, 5);
    }
  } catch {}
  return '-';
};

interface ExcelSheetConfig {
  sheetName: string;
  rows: (string | number | null | undefined)[][];
  colWidths?: number[];
}

const exportToExcel = (filename: string, sheets: ExcelSheetConfig[]) => {
  const wb = XLSX.utils.book_new();

  sheets.forEach((s) => {
    const ws = XLSX.utils.aoa_to_sheet(s.rows);
    if (s.colWidths && s.colWidths.length > 0) {
      ws['!cols'] = s.colWidths.map((w) => ({ wch: w }));
    }
    const safeSheetName = s.sheetName.replace(/[\\/*?:[\]]/g, '').substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
  });

  XLSX.writeFile(wb, filename);
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

  // ---- Exportación CSV profesional, estructurada y compatible con Excel ----

  const exportCitas = async () => {
    if (!reporteCitas) return;

    let citasDetalle = reporteCitas.detalleCitas ?? [];
    if (citasDetalle.length === 0) {
      try {
        const todas = await getCitas();
        citasDetalle = todas
          .filter((c) => {
            const f = c.fecha_hora ? c.fecha_hora.split('T')[0] : '';
            return (!startDate || f >= startDate) && (!endDate || f <= endDate);
          })
          .map((c) => ({
            id: c.id,
            fechaHora: c.fecha_hora,
            estado: c.estado.toUpperCase(),
            mascotaNombre: c.mascota.nombre,
            especie: c.mascota.especie,
            raza: c.mascota.raza || 'Mestizo',
            propietarioNombre: c.propietario?.nombre || 'No asignado',
            propietarioTelefono: c.propietario?.telefono || 'No registrado',
            propietarioEmail: c.propietario?.email || 'No registrado',
            veterinarioNombre: c.veterinario.nombre,
            especialidad: c.veterinario.especialidad_nombre || 'Medicina General',
            motivo: c.motivo || 'Consulta médica',
            observacion: c.motivo_cancelacion || (c.estado === 'atendida' ? 'Atención médica completada' : '-'),
          }));
      } catch (e) {
        console.error('Error al obtener citas para reporte:', e);
      }
    }

    const rowsDetalle = citasDetalle.map((c, i) => [
      i + 1,
      formatFechaLegible(c.fechaHora),
      formatHoraLegible(c.fechaHora),
      etiquetaEstado(c.estado),
      c.mascotaNombre,
      etiquetaEspecie(c.especie),
      c.raza || 'Mestizo',
      c.propietarioNombre || 'No asignado',
      c.propietarioTelefono || 'No registrado',
      c.veterinarioNombre || 'No asignado',
      c.especialidad || 'Medicina General',
      c.motivo || 'Consulta médica',
      c.observacion || '-',
    ]);

    const rowsResumen = [
      ...reporteCitas.porEstado.map((item) => [
        item.etiqueta,
        item.cantidad,
        `${porcentaje(item.cantidad, reporteCitas.total).toFixed(1)}%`,
      ]),
      ['TOTAL GENERAL', reporteCitas.total, '100.0%'],
    ];

    exportToExcel(`reporte-citas_${reporteCitas.fechaInicio}_${reporteCitas.fechaFin}.xlsx`, [
      {
        sheetName: 'Detalle de Citas',
        colWidths: [6, 14, 10, 16, 20, 14, 18, 26, 18, 26, 22, 28, 36],
        rows: [
          ['VETHD PLATAFORMA CLÍNICA - REPORTE DETALLADO DE CITAS MÉDICAS'],
          ['Período del reporte:', `${reporteCitas.fechaInicio} al ${reporteCitas.fechaFin}`],
          ['Fecha y hora de emisión:', new Date().toLocaleString('es-PE')],
          ['Total de citas registradas:', reporteCitas.total],
          [],
          [
            'N°',
            'Fecha',
            'Hora',
            'Estado de Cita',
            'Nombre Mascota',
            'Especie',
            'Raza',
            'Propietario',
            'Teléfono Contacto',
            'Médico Veterinario',
            'Especialidad Médica',
            'Motivo de Consulta',
            'Observaciones / Diagnóstico / Cancelación',
          ],
          ...(rowsDetalle.length > 0 ? rowsDetalle : [['-', '-', '-', '-', 'Sin registros detallados en el período', '-', '-', '-', '-', '-', '-', '-', '-']]),
        ],
      },
      {
        sheetName: 'Resumen Estadístico',
        colWidths: [22, 18, 24],
        rows: [
          ['RESUMEN ESTADÍSTICO DE CITAS POR ESTADO'],
          ['Período:', `${reporteCitas.fechaInicio} al ${reporteCitas.fechaFin}`],
          [],
          ['Estado de Cita', 'Cantidad de Citas', 'Porcentaje del Período'],
          ...rowsResumen,
        ],
      },
    ]);
  };

  const exportVeterinarios = async () => {
    let vetsList: { nombre: string; dni?: string; email?: string; especialidades?: string[]; active?: boolean; atenciones: number }[] = [];
    try {
      const adminVets = await adminVeterinarianService.listar();
      vetsList = adminVets.map((av) => {
        const found = ranking.find((r) => r.id === av.id || r.nombre.toLowerCase() === av.fullName.toLowerCase());
        return {
          nombre: av.fullName,
          dni: av.dni,
          email: av.email,
          especialidades: av.specialties,
          active: av.active,
          atenciones: found ? found.atenciones : 0,
        };
      }).sort((a, b) => b.atenciones - a.atenciones);
    } catch {
      vetsList = ranking.map((r) => ({
        nombre: r.nombre,
        email: r.email,
        especialidades: r.especialidad ? [r.especialidad] : ['Medicina General'],
        active: r.activo !== false,
        atenciones: r.atenciones,
      }));
    }

    const totalAtenciones = vetsList.reduce((acc, v) => acc + v.atenciones, 0);

    const rowsVets = vetsList.map((vet, idx) => [
      idx + 1,
      vet.nombre,
      vet.dni || '-',
      vet.especialidades && vet.especialidades.length > 0 ? vet.especialidades.join(', ') : 'Medicina General',
      vet.email || '-',
      vet.active !== false ? 'Activo' : 'Inactivo',
      vet.atenciones,
      `${porcentaje(vet.atenciones, totalAtenciones).toFixed(1)}%`,
    ]);

    exportToExcel('ranking-veterinarios.xlsx', [
      {
        sheetName: 'Ranking Veterinarios',
        colWidths: [10, 28, 14, 28, 30, 14, 18, 25],
        rows: [
          ['VETHD PLATAFORMA CLÍNICA - REPORTE Y RANKING DEL EQUIPO VETERINARIO'],
          ['Fecha y hora de emisión:', new Date().toLocaleString('es-PE')],
          ['Total de médicos veterinarios:', vetsList.length],
          ['Total de atenciones atendidas:', totalAtenciones],
          [],
          [
            'Posición',
            'Médico Veterinario',
            'DNI',
            'Especialidades',
            'Correo Electrónico',
            'Estado',
            'Citas Atendidas',
            'Participación (% del Total)',
          ],
          ...rowsVets,
          ['Total General', '-', '-', '-', '-', '-', totalAtenciones, '100.0%'],
        ],
      },
    ]);
  };

  const exportEspecies = async () => {
    const rowsEspecies = [
      ...especies.map((item, idx) => [
        idx + 1,
        item.especie,
        item.cantidad,
        `${porcentaje(item.cantidad, totalMascotas).toFixed(1)}%`,
      ]),
      ['Total General', 'Todas las especies', totalMascotas, '100.0%'],
    ];

    let rowsPacientes: (string | number)[][] = [];
    try {
      const citas = await getCitas();
      const mapaMascotas = new Map<string, { nombre: string; especie: string; raza: string; propietario: string; telefono: string }>();
      citas.forEach((c) => {
        if (c.mascota && !mapaMascotas.has(c.mascota.id)) {
          mapaMascotas.set(c.mascota.id, {
            nombre: c.mascota.nombre,
            especie: etiquetaEspecie(c.mascota.especie),
            raza: c.mascota.raza || 'Mestizo',
            propietario: c.propietario?.nombre || 'No asignado',
            telefono: c.propietario?.telefono || 'No registrado',
          });
        }
      });
      rowsPacientes = Array.from(mapaMascotas.values()).map((p, i) => [
        i + 1,
        p.nombre,
        p.especie,
        p.raza,
        p.propietario,
        p.telefono,
      ]);
    } catch {}

    const sheets: ExcelSheetConfig[] = [
      {
        sheetName: 'Distribución por Especie',
        colWidths: [8, 22, 24, 28],
        rows: [
          ['VETHD PLATAFORMA CLÍNICA - REPORTE DEMOGRÁFICO DE PACIENTES POR ESPECIE'],
          ['Fecha y hora de emisión:', new Date().toLocaleString('es-PE')],
          ['Total de mascotas activas:', totalMascotas],
          ['Especies registradas:', especies.length],
          [],
          ['N°', 'Especie Animal', 'Cantidad de Mascotas', 'Porcentaje de la Población'],
          ...rowsEspecies,
        ],
      },
    ];

    if (rowsPacientes.length > 0) {
      sheets.push({
        sheetName: 'Padrón de Pacientes',
        colWidths: [8, 22, 16, 20, 28, 20],
        rows: [
          ['PADRÓN DE PACIENTES REGISTRADOS EN SISTEMA'],
          [],
          ['N°', 'Nombre de Mascota', 'Especie', 'Raza', 'Propietario', 'Teléfono Contacto'],
          ...rowsPacientes,
        ],
      });
    }

    exportToExcel('mascotas-por-especie.xlsx', sheets);
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

        <div className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={exportCitas}
            disabled={!reporteCitas || cargandoCitas || Boolean(errorCitas) || rangoInvalido}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <p className="font-semibold text-slate-800">Exportar citas (.xlsx)</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">Detalle registro por registro y resumen estadístico.</p>
          </button>

          <button
            type="button"
            onClick={exportVeterinarios}
            disabled={cargandoGenerales || Boolean(errorGenerales) || ranking.length === 0}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <p className="font-semibold text-slate-800">Exportar veterinarios (.xlsx)</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">Padrón médico, especialidades y ranking de atenciones.</p>
          </button>

          <button
            type="button"
            onClick={exportEspecies}
            disabled={cargandoGenerales || Boolean(errorGenerales) || especies.length === 0}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <p className="font-semibold text-slate-800">Exportar especies (.xlsx)</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">Demografía por especie y padrón de pacientes.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
