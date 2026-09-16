import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarX,
  Stethoscope,
  Users
} from 'lucide-react';

const MOCK_METRICS = {
  totalCitasMes: 142,
  citasAtendidas: 124,
  citasCanceladas: 18,
  veterinariosActivos: 8,
  propietariosRegistrados: 96,
};

// Criterio 2: Datos simulados para la gráfica semanal
const MOCK_CITAS_DIARIAS = [
  { dia: 'Lun', cantidad: 18 },
  { dia: 'Mar', cantidad: 24 },
  { dia: 'Mié', cantidad: 20 },
  { dia: 'Jue', cantidad: 31 },
  { dia: 'Vie', cantidad: 28 },
  { dia: 'Sáb', cantidad: 22 },
  { dia: 'Dom', cantidad: 6 },
];

export const AdminDashboardPage: React.FC = () => {
  const maxCitas = Math.max(...MOCK_CITAS_DIARIAS.map((item) => item.cantidad));

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">
            Panel de Administración
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Resumen general de las estadísticas del sistema.
        </p>
      </div>

      {/* 1. Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Citas del mes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Citas del mes</p>
            <CalendarCheck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">{MOCK_METRICS.totalCitasMes}</p>
          <p className="text-xs text-slate-400 mt-1">Total registradas</p>
        </div>

        {/* Citas atendidas */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Citas atendidas</p>
            <CalendarCheck className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">{MOCK_METRICS.citasAtendidas}</p>
          <p className="text-xs text-slate-400 mt-1">Citas completadas</p>
        </div>

        {/* Citas canceladas */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Citas canceladas</p>
            <CalendarX className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">{MOCK_METRICS.citasCanceladas}</p>
          <p className="text-xs text-slate-400 mt-1">Cancelaciones del mes</p>
        </div>

        {/* Veterinarios activos */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Veterinarios activos</p>
            <Stethoscope className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">{MOCK_METRICS.veterinariosActivos}</p>
          <p className="text-xs text-slate-400 mt-1">Registrados actualmente</p>
        </div>

        {/* Propietarios registrados */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Propietarios</p>
            <Users className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">{MOCK_METRICS.propietariosRegistrados}</p>
          <p className="text-xs text-slate-400 mt-1">Usuarios registrados</p>
        </div>
      </div>

      {/* 2. Gráfica de citas por día */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Citas por Día</h2>
            <p className="text-xs text-slate-500">Distribución de atenciones en la última semana</p>
          </div>
          <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
            Últimos 7 días
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 h-48 border-b border-slate-100 pb-3 pt-4">
          {MOCK_CITAS_DIARIAS.map((item) => {
            const heightPercent = (item.cantidad / maxCitas) * 100;
            return (
              <div key={item.dia} className="flex flex-col items-center flex-1 gap-2 group">
                <span className="text-xs font-semibold text-slate-600">{item.cantidad}</span>
                <div className="w-full flex items-end justify-center h-32">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[36px] bg-blue-500 rounded-t-md transition-all duration-200 group-hover:bg-blue-600"
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{item.dia}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};