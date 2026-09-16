import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, AlertTriangle, Stethoscope, Save } from 'lucide-react';
import {
  CitaDetallada,
  ModificarCitaValidationErrors,
  VeterinarioDetallado
} from '../../../types/cita.types';
import { CitaEstadoBadge } from './CitaEstadoBadge';
import { ModificarFechaHoraField } from './ModificarFechaHoraField';
import { ModificarMotivoField } from './ModificarMotivoField';
import { ModalConfirmarModificacion } from './ModalConfirmarModificacion';
import { modificarCita, getVeterinarios } from '../../../services/citaService';

interface ModalModificarCitaProps {
  cita: CitaDetallada | null;
  isOpen: boolean;
  onClose: () => void;
  onCitaModificada: (citaActualizada: CitaDetallada) => void;
}

export const ModalModificarCita: React.FC<ModalModificarCitaProps> = ({
  cita,
  isOpen,
  onClose,
  onCitaModificada
}) => {
  const [nuevaFechaHora, setNuevaFechaHora] = useState<string>('');
  const [nuevoMotivo, setNuevoMotivo] = useState<string>('');
  const [veterinarioSeleccionadoId, setVeterinarioSeleccionadoId] = useState<string>('');
  const [listaVeterinarios, setListaVeterinarios] = useState<VeterinarioDetallado[]>([]);
  const [errors, setErrors] = useState<ModificarCitaValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Inicializar estado cada vez que se abre la modal con una cita
  useEffect(() => {
    if (cita) {
      setNuevaFechaHora(cita.fecha_hora);
      setNuevoMotivo(cita.motivo || '');
      setVeterinarioSeleccionadoId(cita.veterinario_id);
      setErrors({});
      setServerError(null);
      setShowConfirmModal(false);
      setListaVeterinarios(getVeterinarios());
    }
  }, [cita, isOpen]);

  if (!isOpen || !cita) return null;

  // Validación de estado según regla de negocio US-15
  const esModificable = cita.estado === 'pendiente';

  // Validar formulario antes de abrir confirmación
  const handlePrevalidar = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const newErrors: ModificarCitaValidationErrors = {};

    if (!esModificable) {
      newErrors.general = `No se puede modificar una cita con estado '${cita.estado}'.`;
    }

    if (!nuevaFechaHora) {
      newErrors.fecha_hora = 'Debes seleccionar una nueva fecha y hora para la cita.';
    } else {
      const fecha = new Date(nuevaFechaHora);
      if (isNaN(fecha.getTime())) {
        newErrors.fecha_hora = 'El formato de fecha y hora no es válido.';
      } else if (fecha.getTime() <= Date.now()) {
        newErrors.fecha_hora = 'La fecha y hora seleccionada debe ser posterior al momento actual.';
      }
    }

    if (!nuevoMotivo.trim()) {
      newErrors.motivo = 'El motivo de la cita es obligatorio.';
    } else if (nuevoMotivo.trim().length < 5) {
      newErrors.motivo = 'El motivo debe tener al menos 5 caracteres.';
    }

    const noHuboCambios =
      nuevaFechaHora === cita.fecha_hora &&
      nuevoMotivo.trim() === (cita.motivo || '').trim() &&
      veterinarioSeleccionadoId === cita.veterinario_id;

    if (noHuboCambios) {
      newErrors.general = 'No se ha detectado ningún cambio en la fecha, hora, veterinario ni motivo.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowConfirmModal(true);
    }
  };

  // Guardar definitivamente tras confirmar
  const handleConfirmarGuardado = async () => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const citaActualizada = await modificarCita({
        id: cita.id,
        fecha_hora: nuevaFechaHora,
        motivo: nuevoMotivo.trim(),
        veterinario_id: veterinarioSeleccionadoId
      });

      setShowConfirmModal(false);
      onCitaModificada(citaActualizada);
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'Ocurrió un error al intentar modificar la cita.');
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
            key="edit-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Tarjeta Modal Principal */}
          <motion.div
            key="edit-modal-content"
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
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center shrink-0">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 font-outfit">
                    Modificar Cita Médica
                  </h2>
                  <CitaEstadoBadge estado={cita.estado} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paciente: <span className="font-semibold text-slate-700">{cita.mascota.nombre}</span> ({cita.mascota.especie}) • Cita ID: <code className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">{cita.id.slice(0, 12)}...</code>
                </p>
              </div>
            </div>

            {/* Aviso si la cita no está pendiente */}
            {!esModificable ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 my-4">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Cita no modificable</h4>
                  <p className="text-xs mt-1 text-rose-700">
                    Solo las citas en estado <strong>'pendiente'</strong> pueden ser modificadas o reprogramadas. Esta cita se encuentra actualmente en estado <strong>'{cita.estado}'</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePrevalidar} className="overflow-y-auto flex-1 pr-1 space-y-5">
                {/* Error de servidor o general */}
                {(serverError || errors.general) && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{serverError || errors.general}</span>
                  </div>
                )}

                {/* Selección de Veterinario */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-[#0d9488]" />
                    Veterinario Asignado
                  </label>
                  <select
                    value={veterinarioSeleccionadoId}
                    onChange={(e) => setVeterinarioSeleccionadoId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-colors"
                  >
                    {listaVeterinarios.map((vet) => (
                      <option key={vet.id} value={vet.id}>
                        {vet.nombre} - {vet.especialidad_nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo Fecha y Hora */}
                <ModificarFechaHoraField
                  fechaHoraOriginal={cita.fecha_hora}
                  veterinarioId={veterinarioSeleccionadoId}
                  citaId={cita.id}
                  value={nuevaFechaHora}
                  onChange={(iso) => {
                    setNuevaFechaHora(iso);
                    setErrors((prev) => ({ ...prev, fecha_hora: undefined, general: undefined }));
                  }}
                  error={errors.fecha_hora}
                />

                {/* Campo Motivo */}
                <ModificarMotivoField
                  motivoOriginal={cita.motivo}
                  value={nuevoMotivo}
                  onChange={(mot) => {
                    setNuevoMotivo(mot);
                    setErrors((prev) => ({ ...prev, motivo: undefined, general: undefined }));
                  }}
                  error={errors.motivo}
                />

                {/* Footer de Acciones */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0d9488] hover:bg-[#0f766e] shadow-lg shadow-[#0d9488]/20 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Modal Secundaria de Confirmación */}
      <ModalConfirmarModificacion
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmarGuardado}
        citaOriginal={cita}
        nuevaFechaHora={nuevaFechaHora}
        nuevoMotivo={nuevoMotivo}
        isLoading={isSubmitting}
      />
    </>
  );
};

