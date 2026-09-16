import React, { useState, useMemo, useEffect } from 'react';
import { Search, CalendarX, CheckCircle, Clock, XCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { CitaDetallada, FiltroEstadoCita } from '../../../types/cita.types';
import { normalizarEstado } from '../../../services/citaService';
import { CitaCard } from './CitaCard';
import { ModalModificarCita } from './ModalModificarCita';
import { ModalCancelarCita } from './ModalCancelarCita';
import { ModalDetalleCita } from './ModalDetalleCita';

interface CitasListProps {
  citas: CitaDetallada[];
  onCitaActualizada: (citaActualizada: CitaDetallada) => void;
  citaIdParaDetalleInicial?: string | null;
  onCerrarDetalle?: () => void;
}

const ITEMS_POR_PAGINA = 6;

export const CitasList: React.FC<CitasListProps> = ({
  citas,
  onCitaActualizada,
  citaIdParaDetalleInicial,
  onCerrarDetalle,
}) => {
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoCita>('TODAS');
  const [busqueda, setBusqueda] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState<number>(1);
  
  // Modales y citas seleccionadas
  const [citaSeleccionadaParaEditar, setCitaSeleccionadaParaEditar] = useState<CitaDetallada | null>(null);
  const [isModalModificarOpen, setIsModalModificarOpen] = useState<boolean>(false);
  
  const [citaSeleccionadaParaCancelar, setCitaSeleccionadaParaCancelar] = useState<CitaDetallada | null>(null);
  const [isModalCancelarOpen, setIsModalCancelarOpen] = useState<boolean>(false);

  // Modal de Detalle de Cita (US-18)
  const [citaIdParaDetalle, setCitaIdParaDetalle] = useState<string | null>(citaIdParaDetalleInicial || null);
  const [isModalDetalleOpen, setIsModalDetalleOpen] = useState<boolean>(Boolean(citaIdParaDetalleInicial));

  useEffect(() => {
    if (citaIdParaDetalleInicial) {
      setCitaIdParaDetalle(citaIdParaDetalleInicial);
      setIsModalDetalleOpen(true);
    }
  }, [citaIdParaDetalleInicial]);

  const handleAbrirDetalle = (cita: CitaDetallada) => {
    setCitaIdParaDetalle(cita.id);
    setIsModalDetalleOpen(true);
  };

  // Banners de confirmación
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeCancelacion, setMensajeCancelacion] = useState<string | null>(null);

  // Contadores por estado según requerimientos de US-17
  const conteoPendientes = useMemo(
    () => citas.filter((c) => normalizarEstado(c.estado) === 'pendiente').length,
    [citas]
  );
  const conteoConfirmadas = useMemo(
    () => citas.filter((c) => normalizarEstado(c.estado) === 'confirmada').length,
    [citas]
  );
  const conteoCanceladas = useMemo(
    () => citas.filter((c) => normalizarEstado(c.estado) === 'cancelada').length,
    [citas]
  );

  // Filtrado reactivo por estado y término de búsqueda
  const citasFiltradas = useMemo(() => {
    return citas.filter((cita) => {
      const estadoNormalizado = normalizarEstado(cita.estado);

      // Filtro por estado: PENDIENTE, CONFIRMADA, CANCELADA
      if (filtroEstado === 'PENDIENTE' && estadoNormalizado !== 'pendiente') {
        return false;
      }
      if (filtroEstado === 'CONFIRMADA' && estadoNormalizado !== 'confirmada') {
        return false;
      }
      if (filtroEstado === 'CANCELADA' && estadoNormalizado !== 'cancelada') {
        return false;
      }

      // Filtro de texto (nombre mascota, especie, raza, nombre veterinario, especialidad o motivo)
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase().trim();
        const nombreMascota = cita.mascota.nombre.toLowerCase();
        const especieMascota = cita.mascota.especie.toLowerCase();
        const razaMascota = (cita.mascota.raza || '').toLowerCase();
        const nombreVet = cita.veterinario.nombre.toLowerCase();
        const especialidad = cita.veterinario.especialidad_nombre.toLowerCase();
        const motivo = (cita.motivo || '').toLowerCase();
        const id = cita.id.toLowerCase();

        return (
          nombreMascota.includes(query) ||
          especieMascota.includes(query) ||
          razaMascota.includes(query) ||
          nombreVet.includes(query) ||
          especialidad.includes(query) ||
          motivo.includes(query) ||
          id.includes(query)
        );
      }

      return true;
    });
  }, [citas, filtroEstado, busqueda]);

  // Reseteo a página 1 al cambiar el filtro o término de búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroEstado, busqueda]);

  // Control de paginación
  const totalElementos = citasFiltradas.length;
  const totalPaginas = Math.max(1, Math.ceil(totalElementos / ITEMS_POR_PAGINA));

  const citasPaginadas = useMemo(() => {
    const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return citasFiltradas.slice(indiceInicio, indiceInicio + ITEMS_POR_PAGINA);
  }, [citasFiltradas, paginaActual]);

  const handleAbrirModificar = (cita: CitaDetallada) => {
    setCitaSeleccionadaParaEditar(cita);
    setIsModalModificarOpen(true);
  };

  const handleAbrirCancelar = (cita: CitaDetallada) => {
    setCitaSeleccionadaParaCancelar(cita);
    setIsModalCancelarOpen(true);
  };

  const handleCitaModificada = (citaActualizada: CitaDetallada) => {
    onCitaActualizada(citaActualizada);
    setMensajeExito(`¡La cita para "${citaActualizada.mascota.nombre}" fue modificada con éxito!`);
    setTimeout(() => setMensajeExito(null), 5000);
  };

  const handleCitaCancelada = (citaActualizada: CitaDetallada, mensaje: string) => {
    onCitaActualizada(citaActualizada);
    setMensajeCancelacion(mensaje);
    setTimeout(() => setMensajeCancelacion(null), 6000);
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

      {/* Banner de notificación al cancelar */}
      {mensajeCancelacion && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{mensajeCancelacion}</span>
          </div>
          <button
            onClick={() => setMensajeCancelacion(null)}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline ml-3"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Barra de Filtros por Estado (PENDIENTE, CONFIRMADA, CANCELADA) y Buscador */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Pestañas de Filtro por Estado */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <button
            type="button"
            onClick={() => setFiltroEstado('TODAS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filtroEstado === 'TODAS'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Todas ({citas.length})
          </button>

          <button
            type="button"
            onClick={() => setFiltroEstado('PENDIENTE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filtroEstado === 'PENDIENTE'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            PENDIENTE ({conteoPendientes})
          </button>

          <button
            type="button"
            onClick={() => setFiltroEstado('CONFIRMADA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filtroEstado === 'CONFIRMADA'
                ? 'bg-[#0d9488] text-white shadow-sm shadow-[#0d9488]/20'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            CONFIRMADA ({conteoConfirmadas})
          </button>

          <button
            type="button"
            onClick={() => setFiltroEstado('CANCELADA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filtroEstado === 'CANCELADA'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            CANCELADA ({conteoCanceladas})
          </button>
        </div>

        {/* Buscador en tiempo real */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por mascota, veterinario, motivo..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid de Citas con Paginación */}
      {citasPaginadas.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {citasPaginadas.map((cita) => (
              <CitaCard
                key={cita.id}
                cita={cita}
                onModificar={handleAbrirModificar}
                onCancelar={handleAbrirCancelar}
                onVerDetalle={handleAbrirDetalle}
              />
            ))}
          </div>

          {/* Controles de Paginación */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
            <div className="text-xs text-slate-500 font-medium">
              Mostrando <span className="font-bold text-slate-800">{(paginaActual - 1) * ITEMS_POR_PAGINA + 1}</span> a{' '}
              <span className="font-bold text-slate-800">{Math.min(paginaActual * ITEMS_POR_PAGINA, totalElementos)}</span> de{' '}
              <span className="font-bold text-slate-800">{totalElementos}</span> citas
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPagina) => (
                  <button
                    key={numPagina}
                    type="button"
                    onClick={() => setPaginaActual(numPagina)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      paginaActual === numPagina
                        ? 'bg-[#0d9488] text-white shadow-sm shadow-[#0d9488]/20'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {numPagina}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                  disabled={paginaActual === totalPaginas}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                  title="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
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
          {(busqueda || filtroEstado !== 'TODAS') && (
            <button
              onClick={() => {
                setBusqueda('');
                setFiltroEstado('TODAS');
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
        isOpen={isModalModificarOpen}
        onClose={() => {
          setIsModalModificarOpen(false);
          setCitaSeleccionadaParaEditar(null);
        }}
        onCitaModificada={handleCitaModificada}
      />

      {/* Modal de Cancelación (US-16) */}
      <ModalCancelarCita
        cita={citaSeleccionadaParaCancelar}
        isOpen={isModalCancelarOpen}
        onClose={() => {
          setIsModalCancelarOpen(false);
          setCitaSeleccionadaParaCancelar(null);
        }}
        onCitaCancelada={handleCitaCancelada}
      />

      {/* Modal de Detalle de Cita (US-18) */}
      <ModalDetalleCita
        citaId={citaIdParaDetalle}
        isOpen={isModalDetalleOpen}
        onClose={() => {
          setIsModalDetalleOpen(false);
          setCitaIdParaDetalle(null);
          onCerrarDetalle?.();
        }}
        onModificar={(citaParaModificar) => {
          setIsModalDetalleOpen(false);
          handleAbrirModificar(citaParaModificar);
        }}
        onCancelar={(citaParaCancelar) => {
          setIsModalDetalleOpen(false);
          handleAbrirCancelar(citaParaCancelar);
        }}
      />
    </div>
  );
};

