import React, { useState, useMemo } from 'react';
import { Search, Filter, CalendarX, CheckCircle, Clock } from 'lucide-react';
import { CitaDetallada, EstadoCita } from '../../../types/cita.types';
import { CitaCard } from './CitaCard';
import { ModalModificarCita } from './ModalModificarCita';

interface CitasListProps {
  citas: CitaDetallada[];
  onCitaActualizada: (citaActualizada: CitaDetallada) => void;
}

export const CitasList: React.FC<CitasListProps> = ({ citas, onCitaActualizada }) => {
  const [filtroEstado, setFiltroEstado] = useState<EstadoCita | 'todas'>('todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [citaSeleccionadaParaEditar, setCitaSeleccionadaParaEditar] = useState<CitaDetallada | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Filtrado reactivo por estado y término de búsqueda
  const citasFiltradas = useMemo(() => {
    return citas.filter((cita) => {
      // Filtro de estado
      if (filtroEstado !== 'todas' && cita.estado !== filtroEstado) {
        return false;
      }

      // Filtro de texto (nombre mascota, nombre veterinario o motivo)
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase().trim();
        const nombreMascota = cita.mascota.nombre.toLowerCase();
        const especieMascota = cita.mascota.especie.toLowerCase();
        const nombreVet = cita.veterinario.nombre.toLowerCase();
        const especialidad = cita.veterinario.especialidad_nombre.toLowerCase();
        const motivo = (cita.motivo || '').toLowerCase();

        return (
          nombreMascota.includes(query) ||
          especieMascota.includes(query) ||
          nombreVet.includes(query) ||
          especialidad.includes(query) ||
          motivo.includes(query)
        );
      }

      return true;
    });
  }, [citas, filtroEstado, busqueda]);

  // Contadores por estado
  const conteoPendientes = citas.filter((c) => c.estado === 'pendiente').length;

  const handleAbrirModificar = (cita: CitaDetallada) => {
    setCitaSeleccionadaParaEditar(cita);
    setIsModalOpen(true);
  };

  const handleCitaGuardada = (citaActualizada: CitaDetallada) => {
    onCitaActualizada(citaActualizada);
    setMensajeExito(`¡La cita para "${citaActualizada.mascota.nombre}" fue modificada con éxito!`);
    setTimeout(() => setMensajeExito(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Banner de éxito temporal al modificar */}
      {mensajeExito && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-sm flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-[#0d9488] shrink-0" />
            <span className="font-semibold">{mensajeExito}</span>
          </div>
          <button
            onClick={() => setMensajeExito(null)}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline ml-3"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Pestañas de Estado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFiltroEstado('todas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filtroEstado === 'todas'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Todas ({citas.length})
          </button>

          <button
            type="button"
            onClick={() => setFiltroEstado('pendiente')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filtroEstado === 'pendiente'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pendientes ({conteoPendientes})
          </button>

          <button
            type="button"
            onClick={() => setFiltroEstado('atendida')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filtroEstado === 'atendida'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Atendidas
          </button>

          <button
            type="button"
            onClick={() => setFiltroEstado('cancelada')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filtroEstado === 'cancelada'
                ? 'bg-slate-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Canceladas
          </button>
        </div>

        {/* Input Buscador */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por mascota, veterinario..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid de Citas */}
      {citasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {citasFiltradas.map((cita) => (
            <CitaCard
              key={cita.id}
              cita={cita}
              onModificar={handleAbrirModificar}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3">
            <CalendarX className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No se encontraron citas
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            {busqueda
              ? `No hay citas que coincidan con "${busqueda}". Intenta con otro término.`
              : `No existen citas registradas con estado '${filtroEstado}'.`}
          </p>
          {(busqueda || filtroEstado !== 'todas') && (
            <button
              onClick={() => {
                setBusqueda('');
                setFiltroEstado('todas');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-[#0d9488] hover:bg-teal-50 border border-teal-200 transition-colors"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      )}

      {/* Modal de Modificación */}
      <ModalModificarCita
        cita={citaSeleccionadaParaEditar}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCitaSeleccionadaParaEditar(null);
        }}
        onCitaModificada={handleCitaGuardada}
      />
    </div>
  );
};

