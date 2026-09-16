import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Stethoscope,
  Calendar,
  Clock,
  Pill,
  FileText,
  Search,
  Activity,
  PawPrint,
  User,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { EntradaHistorialClinico, ModalHistorialClinicoProps } from '../../../types/historial.types';
import { getHistorialPorMascota, findMascotaInfo } from '../../../services/historialService';

export const HistorialClinicoModal: React.FC<ModalHistorialClinicoProps> = ({
  isOpen,
  onClose,
  mascotaId,
  mascotaNombre,
}) => {
  const [entradas, setEntradas] = useState<EntradaHistorialClinico[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Identificador o nombre de búsqueda prioritario
  const targetPetRef = mascotaId || mascotaNombre || '';
  const mascotaInfo = useMemo(() => {
    if (!targetPetRef) return null;
    return findMascotaInfo(targetPetRef);
  }, [targetPetRef]);

  // Cargar historial clínico al abrir modal o cambiar mascota
  useEffect(() => {
    if (isOpen && targetPetRef) {
      setIsLoading(true);
      try {
        const history = getHistorialPorMascota(targetPetRef);
        setEntradas(history);
        // Expandir por defecto todas las entradas para visualización inmediata
        const initialExpanded: Record<string, boolean> = {};
        history.forEach((e) => {
          initialExpanded[e.id] = true;
        });
        setExpandedIds(initialExpanded);
      } catch (err) {
        console.error('Error al cargar historial clínico:', err);
        setEntradas([]);
      } finally {
        setIsLoading(false);
      }
    } else if (!isOpen) {
      setSearchTerm('');
      setEntradas([]);
    }
  }, [isOpen, targetPetRef]);

  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtrar entradas por término de búsqueda en diagnósticos, medicamentos o doctores
  const entradasFiltradas = useMemo(() => {
    if (!searchTerm.trim()) return entradas;
    const term = searchTerm.toLowerCase().trim();
    return entradas.filter(
      (e) =>
        e.diagnostico.toLowerCase().includes(term) ||
        e.tratamiento.toLowerCase().includes(term) ||
        e.observaciones.toLowerCase().includes(term) ||
        e.veterinario.nombre.toLowerCase().includes(term) ||
        e.veterinario.especialidad.toLowerCase().includes(term) ||
        (e.datos && e.datos.toLowerCase().includes(term))
    );
  }, [entradas, searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9995] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Fondo con efecto blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Ventana Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-10 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Cabecera Principal */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-teal-900/5 via-slate-50 to-white">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0d9488]/10 border border-[#0d9488]/20 text-[#0d9488] flex items-center justify-center shadow-sm">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit tracking-tight">
                    Historial Clínico Veterinario
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#0d9488]">
                    <Sparkles className="w-3 h-3" /> US-19
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Expediente de consultas, diagnósticos previos y tratamientos médicos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/60"
                title="Imprimir expediente médico"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                title="Cerrar expediente"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Ficha Resumen de la Mascota */}
          {mascotaInfo && (
            <div className="bg-slate-50/70 border-b border-slate-100 px-5 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center shrink-0">
                    {mascotaInfo.foto_url ? (
                      <img
                        src={mascotaInfo.foto_url}
                        alt={mascotaInfo.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PawPrint className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 leading-none">
                        {mascotaInfo.nombre}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 capitalize">
                        {mascotaInfo.especie}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {mascotaInfo.raza || 'Raza no especificada'}
                      {mascotaInfo.sexo ? ` • ${mascotaInfo.sexo === 'hembra' ? 'Hembra' : 'Macho'}` : ''}
                    </p>
                  </div>
                </div>

                {/* Métricas rápidas */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
                      Atenciones Registradas
                    </span>
                    <span className="text-slate-800 font-bold text-sm">
                      {entradas.length} {entradas.length === 1 ? 'consulta' : 'consultas'}
                    </span>
                  </div>

                  {entradas.length > 0 && (
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
                        Última Visita
                      </span>
                      <span className="text-teal-700 font-bold text-sm">
                        {new Date(entradas[0].fecha_atencion).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Barra de Filtro y Búsqueda */}
          <div className="px-5 sm:px-6 py-3 border-b border-slate-100 flex items-center gap-3 bg-white">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por diagnóstico, tratamiento, medicamento o veterinario tratante..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
              />
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Listado Cronológico de Entradas de Historial Clínico */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 bg-slate-50/40">
            {isLoading ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500">Cargando expediente clínico...</p>
              </div>
            ) : entradasFiltradas.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-[#0d9488] flex items-center justify-center">
                  {searchTerm ? <AlertCircle className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {searchTerm
                      ? 'No se encontraron registros con los términos ingresados'
                      : 'Sin atenciones previas en el historial clínico'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    {searchTerm
                      ? `No hay coincidencias para "${searchTerm}". Intenta buscar con otras palabras clave.`
                      : 'Esta mascota aún no tiene consultas médicas registradas en su ficha médica. Los diagnósticos y tratamientos atendidos se archivarán aquí automáticamente.'}
                  </p>
                </div>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0d9488] bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                  >
                    Ver todas las atenciones
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {entradasFiltradas.map((entrada, index) => {
                  const isExpanded = expandedIds[entrada.id] ?? true;
                  const fechaObj = new Date(entrada.fecha_atencion);
                  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });
                  const horaFormateada = fechaObj.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <motion.div
                      key={entrada.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all overflow-hidden"
                    >
                      {/* Cabecera de la Entrada Médica */}
                      <div
                        onClick={() => toggleExpand(entrada.id)}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors border-b border-slate-100"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center shrink-0">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-black text-slate-900 capitalize">
                                {fechaFormateada}
                              </span>
                              <span className="text-slate-400 text-xs">•</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {horaFormateada}
                              </span>
                              {index === 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#0d9488] border border-teal-200">
                                  Más reciente
                                </span>
                              )}
                            </div>
                            {/* Veterinario Tratante */}
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                              <span className="font-semibold text-slate-800 flex items-center gap-1">
                                <Stethoscope className="w-3.5 h-3.5 text-[#0d9488]" />
                                {entrada.veterinario.nombre}
                              </span>
                              <span className="text-slate-300">|</span>
                              <span className="text-slate-500 font-medium">
                                {entrada.veterinario.especialidad}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
                            ID: {entrada.id.slice(-7)}
                          </span>
                          <button
                            type="button"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title={isExpanded ? 'Contraer ficha' : 'Expandir ficha'}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Contenido Detallado de la Ficha Médica */}
                      {isExpanded && (
                        <div className="p-5 space-y-4 text-xs sm:text-sm">
                          {/* Motivo de consulta si existe */}
                          {entrada.motivo_consulta && (
                            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
                              <span className="font-bold text-slate-700 block mb-0.5">
                                Motivo de Consulta:
                              </span>
                              <p className="text-slate-600 italic">
                                "{entrada.motivo_consulta}"
                              </p>
                            </div>
                          )}

                          {/* 1. DIAGNÓSTICO */}
                          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100/80">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Stethoscope className="w-4 h-4 text-[#0d9488]" />
                              <span className="font-bold text-teal-900 uppercase tracking-wider text-[11px]">
                                Diagnóstico Médico
                              </span>
                            </div>
                            <p className="text-slate-800 font-semibold leading-relaxed">
                              {entrada.diagnostico}
                            </p>
                          </div>

                          {/* 2. TRATAMIENTO Y MEDICACIÓN */}
                          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/70">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Pill className="w-4 h-4 text-amber-600" />
                              <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                                Tratamiento y Medicación Prescrita
                              </span>
                            </div>
                            <p className="text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                              {entrada.tratamiento}
                            </p>
                          </div>

                          {/* 3. OBSERVACIONES Y NOTAS CLÍNICAS */}
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                            <div className="flex items-center gap-2 mb-1.5">
                              <FileText className="w-4 h-4 text-slate-500" />
                              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                                Observaciones y Recomendaciones Clínicas
                              </span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {entrada.observaciones}
                            </p>
                          </div>

                          {/* 4. DATOS / SIGNOS VITALES (si existen) */}
                          {entrada.datos && (
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                              <span className="font-semibold text-slate-600">
                                Signos Vitales y Constantes:
                              </span>
                              <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                                {entrada.datos}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pie del Modal */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-[#0d9488]" />
              <span>Registro médico confidencial protegido</span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all"
            >
              Cerrar Expediente
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
