import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calendar, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { CitaDetallada } from '../../../types/cita.types';

interface ModalConfirmarModificacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  citaOriginal: CitaDetallada;
  nuevaFechaHora: string;
  nuevoMotivo: string;
  isLoading?: boolean;
}

export const ModalConfirmarModificacion: React.FC<ModalConfirmarModificacionProps> = ({
  isOpen,
  onClose,
  onConfirm,
  citaOriginal,
  nuevaFechaHora,
  nuevoMotivo,
  isLoading = false
}) => {
  // Cerrar al pulsar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  const formatearFechaHora = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const fechaOriginalFormateada = formatearFechaHora(citaOriginal.fecha_hora);
  const nuevaFechaFormateada = formatearFechaHora(nuevaFechaHora);
  const huboCambioFecha = citaOriginal.fecha_hora !== nuevaFechaHora;
  const huboCambioMotivo = citaOriginal.motivo !== nuevoMotivo;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop con desenfoque suave */}
          <motion.div
            key="confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Tarjeta de Confirmación */}
          <motion.div
            key="confirm-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 overflow-hidden text-left"
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cabecera */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">
                  Confirmar Modificación de Cita
                </h3>
                <p className="text-xs text-slate-500">
                  Revisa los cambios antes de guardar la reprogramación
                </p>
              </div>
            </div>

            {/* Información del paciente y profesional */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
                  {citaOriginal.mascota.nombre.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">
                    {citaOriginal.mascota.nombre}
                  </span>
                  <span className="text-slate-500 capitalize">
                    {citaOriginal.mascota.especie} {citaOriginal.mascota.raza ? `• ${citaOriginal.mascota.raza}` : ''}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-semibold text-slate-700 block flex items-center gap-1 justify-end">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  {citaOriginal.veterinario.nombre}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {citaOriginal.veterinario.especialidad_nombre}
                </span>
              </div>
            </div>

            {/* Comparativa Antes / Después */}
            <div className="space-y-3 mb-6">
              {/* Fecha y Hora */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Fecha y Hora de Atención
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                  <span className="text-slate-500 line-through bg-slate-100 px-2.5 py-1 rounded-lg">
                    {fechaOriginalFormateada}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#0d9488] shrink-0 hidden sm:block" />
                  <span className="font-bold text-teal-900 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
                    {nuevaFechaFormateada}
                  </span>
                </div>
              </div>

              {/* Motivo */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Motivo de la Cita
                </span>
                {huboCambioMotivo ? (
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-400 line-through italic">"{citaOriginal.motivo}"</p>
                    <p className="text-slate-800 font-medium">"{nuevoMotivo}"</p>
                  </div>
                ) : (
                  <p className="text-slate-700 text-xs italic">Sin cambios en el motivo ("{nuevoMotivo}")</p>
                )}
              </div>
            </div>

            {/* Alerta informativa */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2 mb-6">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Al confirmar, se actualizará la agenda del veterinario y se guardará el nuevo horario en el sistema.
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
              >
                Volver a editar
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading || (!huboCambioFecha && !huboCambioMotivo)}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0d9488] hover:bg-[#0f766e] shadow-lg shadow-[#0d9488]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirmar y Guardar</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

