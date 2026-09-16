import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface MarkAsNotAttendedDialogProps {
  abierto: boolean;
  nombreMascota: string;
  cargando?: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export const MarkAsNotAttendedDialog: React.FC
  MarkAsNotAttendedDialogProps
> = ({
  abierto,
  nombreMascota,
  cargando = false,
  onCancelar,
  onConfirmar
}) => {
  if (!abierto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmar-cita-no-atendida"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
            aria-label="Cerrar confirmación"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <h2
            id="confirmar-cita-no-atendida"
            className="text-lg font-bold text-slate-800"
          >
            ¿Marcar cita como no atendida?
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Confirmarás que {nombreMascota} no se presentó o la atención no
            pudo realizarse. La cita dejará de aparecer en Atenciones en
            curso.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? 'Marcando...' : 'Sí, marcar como no atendida'}
          </button>
        </div>
      </div>
    </div>
  );
};