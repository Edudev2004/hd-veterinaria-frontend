import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, UserCheck, AlertOctagon, Trash2 } from 'lucide-react';
import { CitaDetallada } from '../../../types/cita.types';
import { CancelarAdvertenciaAlert } from './CancelarAdvertenciaAlert';

interface ModalConfirmarCancelacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cita: CitaDetallada;
  motivoCancelacion: string;
  isLoading?: boolean;
}

export const ModalConfirmarCancelacion: React.FC<ModalConfirmarCancelacionProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cita,
  motivoCancelacion,
  isLoading = false
}) => {
  // Manejo de la tecla Escape para accesibilidad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  const { fechaTexto, horaTexto } = (() => {
    try {
      const d = new Date(cita.fecha_hora);
      const fechaTexto = d.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const horaTexto = d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return { fechaTexto, horaTexto };
    } catch {
      return { fechaTexto: cita.fecha_hora, horaTexto: '' };
    }
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop con blur */}
          <motion.div
            key="confirm-cancel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />

          {/* Diálogo emergente */}
          <motion.div
            key="confirm-cancel-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 z-10 overflow-hidden text-left"
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cabecera destructiva */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">
                  ¿Confirmas la cancelación de la cita?
                </h3>
                <p className="text-xs text-slate-500">
                  Esta acción es definitiva y liberará el horario reservado
                </p>
              </div>
            </div>

            {/* Resumen de la Cita */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 mb-4 space-y-3 text-xs">
              {/* Paciente y Profesional */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                    {cita.mascota.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      {cita.mascota.nombre}
                    </span>
                    <span className="text-slate-500 capitalize text-xs">
                      {cita.mascota.especie} {cita.mascota.raza ? `• ${cita.mascota.raza}` : ''}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-semibold text-slate-800 block flex items-center gap-1 justify-end">
                    <UserCheck className="w-3.5 h-3.5 text-[#0d9488]" />
                    {cita.veterinario.nombre}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {cita.veterinario.especialidad_nombre}
                  </span>
                </div>
              </div>

              {/* Fecha y Hora */}
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex items-center gap-1.5 font-semibold capitalize">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span>{fechaTexto}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <Clock className="w-4 h-4 text-rose-500" />
                  <span>{horaTexto}</span>
                </div>
              </div>

              {/* Motivo de cancelación registrado */}
              <div className="pt-2 border-t border-slate-200/70">
                <span className="font-semibold text-rose-900 block mb-1">
                  Motivo de cancelación justificado:
                </span>
                <p className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-200/60 text-slate-800 italic">
                  "{motivoCancelacion}"
                </p>
              </div>
            </div>

            {/* Advertencia de consecuencias */}
            <CancelarAdvertenciaAlert
              veterinarioNombre={cita.veterinario.nombre}
              className="mb-6"
            />

            {/* Botones de acción */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
              >
                No cancelar, volver
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading || !motivoCancelacion.trim()}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Sí, Cancelar Cita</span>
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

