import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  CalendarDays,
  PawPrint,
  Stethoscope,
  Loader2,
  Download,
  AlertCircle,
} from 'lucide-react';
import {
  adminReportsService,
  CitasReporteDTO,
  VeterinarioRankingDTO,
  MascotasEspecieDTO,
} from '../services/adminReportsService';

export const AdminReportsPage: React.FC = () => {
  const getDefaultDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];
    return { firstDay, today };
  };

  const { firstDay, today } = getDefaultDates();
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(today);

  const [citasReporte, setCitasReporte] = useState<CitasReporteDTO | null>(null);
  const [rankingVets, setRankingVets] = useState<VeterinarioRankingDTO[]>([]);
  const [especiesReporte, setEspeciesReporte] = useState<MascotasEspecieDTO[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarReportes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [citas, vets, especies] = await Promise.all([
        adminReportsService.obtenerReporteCitas(startDate, endDate),
        adminReportsService.obtenerRankingVeterinarios(),
        adminReportsService.obtenerReporteMascotasPorEspecie(),
      ]);
      setCitasReporte(citas);
      setRankingVets(vets);
      setEspeciesReporte(especies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los reportes estadísticos.');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    void cargarReportes();
  }, [cargarReportes]);

  const downloadCsv = (filename: string, content: string) => {
    const blob = new Blob([content], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCitasPorEstado = () => {
    const headers = ['Estado', 'Total de Citas'];
    const rows = Object.entries(citasReporte?.desglosePorEstado || {}).map(([estado, cant]) => [
      estado,
      cant.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((value) => `"${value}"`).join(',')),
      `"TOTAL GENERAL","${citasReporte?.totalCitas || 0}"`,
    ].join('\n');

    downloadCsv(`reporte-citas-${startDate}-a-${endDate}.csv`, csv);
  };

  const exportVeterinarians = () => {
    const headers = ['Posición', 'Veterinario', 'Atenciones Realizadas'];
    const rows = [...rankingVets].map((vet, index) => [
      (index + 1).toString(),
      vet.nombreCompleto,
      vet.citasAtendidas.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((value) => `"${value}"`).join(',')),
    ].join('\n');

    downloadCsv('ranking-veterinarios.csv', csv);
  };

  const exportSpecies = () => {
    const headers = ['Especie', 'Cantidad de Mascotas'];
    const rows = especiesReporte.map((item) => [
      item.especie,
      item.cantidad.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((value) => `"${value}"`).join(',')),
    ].join('\n');

    downloadCsv('estadisticas-especies.csv', csv);
  };

  const totalAtendidas = citasReporte?.desglosePorEstado?.['ATENDIDA'] ?? 0;
  const totalCanceladas = citasReporte?.desglosePorEstado?.['CANCELADA'] ?? 0;
  const totalPendientes = citasReporte?.desglosePorEstado?.['PENDIENTE'] ?? 0;
  const totalMascotas = especiesReporte.reduce((acc, curr) => acc + curr.cantidad, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Reportes y Estadísticas
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Información estadística consolidada y reportes del sistema en tiempo real.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <p>{error}</p>
          </div>
          <button
            onClick={() => void cargarReportes()}
            className="font-bold underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Filtro de Fechas */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Filtro de Período para Citas
          </h2>
          <p className="text-xs text-slate-500">
            Selecciona el rango de fechas para consultar las atenciones.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-end">
          <div>
            <label htmlFor="startDate" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Fecha de inicio
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Fecha de fin
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <button
              onClick={() => void cargarReportes()}
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualizar Reportes'}
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas Resumen */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={20} />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Citas en el período</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{citasReporte?.totalCitas ?? 0}</p>
          <p className="text-xs text-slate-400 mt-0.5">Entre {startDate} y {endDate}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Stethoscope size={20} />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Citas Atendidas</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{totalAtendidas}</p>
          <p className="text-xs text-slate-400 mt-0.5">Completadas con éxito</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <BarChart3 size={20} />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Canceladas / Pendientes</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalCanceladas} / {totalPendientes}</p>
          <p className="text-xs text-slate-400 mt-0.5">En el rango seleccionado</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <PawPrint size={20} />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Mascotas</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalMascotas}</p>
          <p className="text-xs text-slate-400 mt-0.5">Distribuidas por especie</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          {/* Desglose de Citas por Estado */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Desglose de Citas por Estado
                </h2>
                <p className="text-xs text-slate-500">
                  Distribución de estados para el período {startDate} al {endDate}.
                </p>
              </div>

              <button
                onClick={exportCitasPorEstado}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar CSV
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {Object.entries(citasReporte?.desglosePorEstado || {}).map(([estado, cant]) => (
                <div key={estado} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="text-xs font-semibold text-slate-500 uppercase">{estado}</span>
                  <p className="text-xl font-bold text-slate-800 mt-1">{cant}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Ranking de Veterinarios */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Veterinarios más solicitados
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ranking de veterinarios según citas atendidas.
                  </p>
                </div>

                <button
                  onClick={exportVeterinarians}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>

              {rankingVets.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No hay atenciones registradas todavía.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Veterinario</th>
                        <th className="py-2.5 px-3 text-right">Atenciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rankingVets.map((vet, idx) => (
                        <tr key={vet.veterinarianId} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-semibold text-slate-700">#{idx + 1}</td>
                          <td className="py-3 px-3 font-medium text-slate-800">{vet.nombreCompleto}</td>
                          <td className="py-3 px-3 text-right font-bold text-emerald-600">{vet.citasAtendidas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Mascotas por Especie */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Distribución por Especie
                  </h2>
                  <p className="text-xs text-slate-500">
                    Población de mascotas registradas en la clínica.
                  </p>
                </div>

                <button
                  onClick={exportSpecies}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>

              {especiesReporte.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No hay mascotas registradas.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {especiesReporte.map((item) => {
                    const percent = totalMascotas > 0 ? (item.cantidad / totalMascotas) * 100 : 0;
                    return (
                      <div key={item.especie} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-medium text-slate-700">
                          <span>{item.especie}</span>
                          <span>{item.cantidad} ({percent.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${percent}%` }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
