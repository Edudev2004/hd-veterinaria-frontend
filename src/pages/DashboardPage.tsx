import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Calendar, AlertTriangle, Plus } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Subtitle */}
      <p className="text-slate-500 font-normal text-base -mt-4">
        Aquí está el resumen del bienestar de tus mascotas.
      </p>

      {/* Top Grid: Próximas Citas & Avisos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Citas Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">
              Próximas Citas
            </h3>
            <a href="/citas" className="text-xs font-semibold text-[#0d9488] hover:underline flex items-center gap-1">
              Ver todas &rsaquo;
            </a>
          </div>

          <div className="flex flex-col gap-4">
            {/* Appointment 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex flex-col items-center justify-center font-bold text-xs shadow-sm">
                  <span className="text-base leading-none">15</span>
                  <span className="text-[10px] uppercase tracking-wider leading-none">OCT</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Vacunación Anual - Luna</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    10:00 AM - Dr. Martínez
                  </p>
                </div>
              </div>
              <Badge variant="confirmed">Confirmada</Badge>
            </div>

            {/* Appointment 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex flex-col items-center justify-center font-bold text-xs shadow-sm">
                  <span className="text-base leading-none">22</span>
                  <span className="text-[10px] uppercase tracking-wider leading-none">OCT</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Revisión Dental - Max</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    04:30 PM - Dra. Ruiz
                  </p>
                </div>
              </div>
              <Badge variant="pending">Pendiente</Badge>
            </div>
          </div>
        </div>

        {/* Avisos Card */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 font-outfit mb-4">
            Avisos
          </h3>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/60 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              Desparasitación Pendiente
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Max requiere su dosis trimestral.
            </p>
            <button className="text-xs font-bold text-amber-900 underline hover:text-amber-950 mt-1 self-start">
              Programar ahora
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Mis Mascotas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900 font-outfit">
            Mis Mascotas
          </h3>
          <button className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1">
            <Plus className="w-4 h-4" /> Añadir Mascota
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Pet 1: Luna */}
          <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative h-44 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80"
                alt="Luna"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="healthy">Saludable</Badge>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Luna</h4>
                <p className="text-xs text-slate-500">Perro &bull; Golden Retriever &bull; 3 años</p>
              </div>
              <button className="w-full py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                Historial
              </button>
            </div>
          </div>

          {/* Pet 2: Max */}
          <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative h-44 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80"
                alt="Max"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="warning">Atención</Badge>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Max</h4>
                <p className="text-xs text-slate-500">Gato &bull; Bombay &bull; 1 año</p>
              </div>
              <button className="w-full py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                Historial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
