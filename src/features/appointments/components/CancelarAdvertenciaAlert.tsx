import React from 'react';
import { AlertTriangle, Clock, BellRing, Undo2 } from 'lucide-react';

interface CancelarAdvertenciaAlertProps {
  veterinarioNombre?: string;
  className?: string;
}

export const CancelarAdvertenciaAlert: React.FC<CancelarAdvertenciaAlertProps> = ({
  veterinarioNombre,
  className = ''
}) => {
  return (
    <div
      className={`p-4 rounded-2xl bg-rose-50/80 border border-rose-200/90 text-rose-900 text-xs shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-6 h-6 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
        <span className="font-bold text-rose-950 text-xs sm:text-sm">
          Consecuencias de cancelar esta cita
        </span>
      </div>

      <ul className="space-y-2 text-rose-800/90 pl-1">
        <li className="flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          <span>
            <strong>Liberación de horario:</strong> La franja horaria reservada quedará inmediatamente disponible para la atención de otros pacientes.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <BellRing className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          <span>
            <strong>Notificación al profesional:</strong> {veterinarioNombre ? `${veterinarioNombre}` : 'El veterinario'} recibirá la notificación de la cancelación junto con el motivo ingresado.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Undo2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          <span>
            <strong>Acción no reversible:</strong> El estado pasará a <code>cancelada</code>. Si deseas retomar la atención, deberás agendar una nueva cita.
          </span>
        </li>
      </ul>
    </div>
  );
};

