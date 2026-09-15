import React from 'react';
import { BarChart3, CalendarDays, PawPrint, Stethoscope } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Reportes y Estadísticas
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Consulta información estadística y reportes del sistema veterinario.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <CalendarDays size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Citas por período
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Consulta las citas registradas durante un período determinado.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Stethoscope size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Veterinarios más solicitados
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Consulta el ranking de veterinarios según las atenciones.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <PawPrint size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Mascotas por especie
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Visualiza las mascotas atendidas agrupadas por especie.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <BarChart3 size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Estadísticas generales
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Consulta los principales indicadores del sistema.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">
          Panel de reportes
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Los reportes y estadísticas estarán disponibles en este panel.
        </p>
      </div>
    </div>
  );
};