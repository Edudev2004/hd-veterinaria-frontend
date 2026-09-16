import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  Stethoscope,
  PawPrint,
  FileText,
  CalendarX,
  Edit3,
  Hash,
  Mail,
  HelpCircle,
  Tag
} from 'lucide-react';
import { CitaDetallada, ModalDetalleCitaProps } from '../../../types/cita.types';
import { getCitaById, normalizarEstado } from '../../../services/citaService';
import { CitaEstadoBadge } from './CitaEstadoBadge';

export const ModalDetalleCita: React.FC<ModalDetalleCitaProps> = ({
  citaId,
  isOpen,
  onClose,
  onModificar,
  onCancelar,
}) => {
  const [cita, setCita] = useState<CitaDetallada | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Consulta directa de la cita por su ID desde el array 'appointments' en localStorage
  useEffect(() => {
    if (isOpen && citaId) {
      setIsLoading(true);
      try {
        const citaConsultada = getCitaById(citaId);
        setCita(citaConsultada);
      } catch (error) {
        console.error('Error al consultar el detalle de la cita por ID:', error);
        setCita(null);
      } finally {
        setIsLoading(false);
      }
    } else if (!isOpen) {
      setCita(null);
    }
  }, [isOpen, citaId]);

  if (!isOpen) return null;

  const estadoNormalizado = cita?.estado ? normalizarEstado(cita.estado) : 'pendiente';
  const esCancelada = estadoNormalizado === 'cancelada';
  const esModificable = estadoNormalizado === 'pendiente';
  const esCancelable = estadoNormalizado === 'pendiente' || estadoNormalizado === 'confirmada';

  // Formateo de fecha y hora
  const { fechaFormateada, horaFormateada, fechaCreacionFormateada } = (() => {
    if (!cita) return { fechaFormateada: '', horaFormateada: '', fechaCreacionFormateada: '' };
    try {
      const fechaObj = new Date(cita.fecha_hora);
      const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const horaFormateada = fechaObj.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const fechaCreacionObj = new Date(cita.created_at);
      const fechaCreacionFormateada = fechaCreacionObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return { fechaFormateada, horaFormateada, fechaCreacionFormateada };
    } catch {
      return {
        fechaFormateada: cita.fecha_hora,
        horaFormateada: '',
        fechaCreacionFormateada: cita.created_at
      };
    }
  })();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop con desenfoque */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Contenedor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-10 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Cabecera del Modal */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-outfit tracking-tight">
                    Detalle de Cita Médica
                  </h3>
                  {cita && <CitaEstadoBadge estado={cita.estado} />}
                </div>
                <p className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                  <Hash className="w-3 h-3" />
                  <span>ID: {citaId}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo del Modal */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-medium">Cargando información de la cita desde el sistema...</p>
              </div>
            ) : !cita ? (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mb-3">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Cita no encontrada</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  No se pudo encontrar ningún registro para el identificador "{citaId}" en el almacén de citas.
                </p>
              </div>
            ) : (
              <>
                {/* Alerta de Cita Cancelada con Justificación Registrada */}
                {esCancelada && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5 text-rose-950 shadow-sm animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 shrink-0 mt-0.5">
                        <CalendarX className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                            Cita Cancelada
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-rose-900">
                          Justificación del motivo de cancelación registrado:
                        </h4>
                        <p className="text-xs sm:text-sm text-rose-800 bg-white/80 p-3 rounded-xl border border-rose-200/80 font-medium leading-relaxed italic">
                          "{cita.motivo_cancelacion || 'Cancelación registrada en el sistema sin justificación adicional.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid 2 Columnas: Paciente Mascota y Profesional Veterinario */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tarjeta de Mascota */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <PawPrint className="w-3.5 h-3.5 text-teal-600" />
                        Paciente Mascota
                      </span>
                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 capitalize">
                        {cita.mascota.especie}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      {cita.mascota.foto_url ? (
                        <img
                          src={cita.mascota.foto_url}
                          alt={cita.mascota.nombre}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-[#0d9488] font-bold text-xl flex items-center justify-center shadow-sm shrink-0">
                          {cita.mascota.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="truncate">
                        <h4 className="text-base font-black text-slate-900 truncate">
                          {cita.mascota.nombre}
                        </h4>
                        <p className="text-xs text-slate-500 capitalize truncate mt-0.5">
                          {cita.mascota.raza ? `Raza: ${cita.mascota.raza}` : 'Raza: Mestizo / no especificada'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta de Veterinario y Especialidad */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        Profesional Asignado
                      </span>
                      <span className="text-[11px] font-semibold text-[#0d9488] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                        {cita.veterinario.especialidad_nombre}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-xl flex items-center justify-center shadow-sm shrink-0">
                        {cita.veterinario.nombre.replace(/^(Dr\.|Dra\.)\s*/i, '').charAt(0).toUpperCase()}
                      </div>

                      <div className="truncate">
                        <h4 className="text-base font-black text-slate-900 truncate">
                          {cita.veterinario.nombre}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 truncate mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{cita.veterinario.email}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fecha y Horario Programado */}
                <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-teal-200 text-[#0d9488] flex items-center justify-center shadow-xs shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
                        Fecha Programada
                      </span>
                      <span className="text-sm font-black text-slate-900 capitalize">
                        {fechaFormateada}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-teal-100 pt-2 sm:pt-0 sm:pl-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-teal-200 text-[#0d9488] flex items-center justify-center shadow-xs shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
                        Hora de Atención
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {horaFormateada} hrs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Motivo Original de la Consulta */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-[#0d9488]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Motivo Original de la Consulta
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 bg-slate-50/90 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                    {cita.motivo_original || 'Consulta médica veterinaria estándar'}
                  </p>
                </div>

                {/* Metadatos del Sistema */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-100">
                  <span>Fecha de creación / solicitud: {fechaCreacionFormateada}</span>
                  <span className="font-mono">UUID: {cita.id}</span>
                </div>
              </>
            )}
          </div>

          {/* Pie del Modal con Acciones Contextuales */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cerrar
            </button>

            {cita && (
              <div className="flex items-center gap-2">
                {esModificable && onModificar && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onModificar(cita);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#0d9488] bg-teal-50 hover:bg-[#0d9488] hover:text-white border border-teal-200 hover:border-[#0d9488] rounded-xl transition-all shadow-sm active:scale-95"
                    title="Reprogramar fecha, hora o cambiar motivo"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modificar Cita</span>
                  </button>
                )}

                {esCancelable && onCancelar && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onCancelar(cita);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 rounded-xl transition-all shadow-sm active:scale-95"
                    title="Cancelar esta cita médica"
                  >
                    <CalendarX className="w-3.5 h-3.5" />
                    <span>Cancelar Cita</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
