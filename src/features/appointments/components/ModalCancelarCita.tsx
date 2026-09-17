import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CalendarX, Trash2 } from 'lucide-react';
import {
  CitaDetallada,
  MotivoCancelacionCategoria,
  CancelarCitaValidationErrors
} from '../../../types/cita.types';
import { CitaEstadoBadge } from './CitaEstadoBadge';
import { CancelarMotivoField } from './CancelarMotivoField';
import { ModalConfirmarCancelacion } from './ModalConfirmarCancelacion';
import { cancelarCita } from '../../../services/citaService';

interface ModalCancelarCitaProps {
  cita: CitaDetallada | null;
  isOpen: boolean;
  onClose: () => void;
  onCitaCancelada: (citaCancelada: CitaDetallada, mensajeExito: string) => void;
}

export const ModalCancelarCita: React.FC<ModalCancelarCitaProps> = ({
  cita,
  isOpen,
  onClose,
  onCitaCancelada
}) => {
  const [motivoTexto, setMotivoTexto] = useState<string>('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<MotivoCancelacionCategoria | null>(null);
  const [errors, setErrors] = useState<CancelarCitaValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Inicializar o reiniciar estado cuando cambia la cita o visibilidad
  useEffect(() => {
    if (cita && isOpen) {
      setMotivoTexto('');
      setCategoriaSeleccionada(null);
      setErrors({});
      setServerError(null);
      setShowConfirmModal(false);
    }
  }, [cita, isOpen]);

  if (!isOpen || !cita) return null;

  // Validación estricta según bd-veterinaria-hd.sql: solo 'pendiente' permite cancelación
  const esCancelable = cita.estado === 'pendiente';

  // Validación previa antes de solicitar confirmación final
  const handlePrevalidar = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const newErrors: CancelarCitaValidationErrors = {};

    if (!esCancelable) {
      newErrors.general = `No es posible cancelar una cita en estado '${cita.estado}'. Solo se pueden cancelar citas en estado 'pendiente'.`;
    }

    const textoLimpio = motivoTexto.trim();
    if (!textoLimpio) {
      newErrors.motivo_cancelacion = 'Debes ingresar o seleccionar un motivo para la cancelación.';
    } else if (textoLimpio.length < 5) {
      newErrors.motivo_cancelacion = 'El motivo de cancelación debe tener al menos 5 caracteres.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowConfirmModal(true);
    }
  };

  // Procesar la cancelación definitiva
  const handleConfirmarCancelacion = async () => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await cancelarCita({
        id: cita.id,
        motivo_cancelacion: motivoTexto.trim(),
        categoria_motivo: categoriaSeleccionada || undefined
      });

      setShowConfirmModal(false);
      onCitaCancelada(result.cita, result.mensaje);
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'Ocurrió un error al procesar la cancelación de la cita.');
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Fondo oscuro con desenfoque */}
          <motion.div
            key="cancel-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Tarjeta Modal Principal */}
          <motion.div
            key="cancel-modal-content"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 overflow-hidden max-h-[90vh] flex flex-col text-left"
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Encabezado */}
            <div className="flex items-start gap-3.5 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <CalendarX className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 font-outfit">
                    Cancelar Cita Médica
                  </h2>
                  <CitaEstadoBadge estado={cita.estado} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paciente: <span className="font-semibold text-slate-700">{cita.mascota.nombre}</span> ({cita.mascota.especie}) • Cita ID: <code className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">{cita.id.slice(0, 12)}...</code>
                </p>
              </div>
            </div>

            {/* Advertencia si la cita no es cancelable */}
            {!esCancelable ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 my-4">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Cita no cancelable</h4>
                  <p className="text-xs mt-1 text-rose-700">
                    Solo las citas en estado <strong>'pendiente'</strong> pueden ser canceladas. Esta cita se encuentra actualmente en estado <strong>'{cita.estado}'</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePrevalidar} className="overflow-y-auto flex-1 pr-1 space-y-5">
                {/* Mensaje de error general o del servidor */}
                {(serverError || errors.general) && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{serverError || errors.general}</span>
                  </div>
                )}

                {/* Formulario de motivos y justificación */}
                <CancelarMotivoField
                  motivoOriginal={cita.motivo}
                  categoriaSeleccionada={categoriaSeleccionada}
                  onSelectCategoria={(cat) => {
                    setCategoriaSeleccionada(cat);
                    setErrors((prev) => ({ ...prev, motivo_cancelacion: undefined, general: undefined }));
                  }}
                  motivoTexto={motivoTexto}
                  onChangeMotivoTexto={(texto) => {
                    setMotivoTexto(texto);
                    setErrors((prev) => ({ ...prev, motivo_cancelacion: undefined, general: undefined }));
                  }}
                  error={errors.motivo_cancelacion}
                />

                {/* Footer de Acciones */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || motivoTexto.trim().length < 5}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Continuar Cancelación</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Modal Secundaria de Confirmación Definitiva */}
      <ModalConfirmarCancelacion
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmarCancelacion}
        cita={cita}
        motivoCancelacion={motivoTexto.trim()}
        isLoading={isSubmitting}
      />
    </>
  );
};

