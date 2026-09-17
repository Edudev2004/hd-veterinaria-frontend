import React from 'react';
import { FileText, AlertCircle, HelpCircle } from 'lucide-react';

interface ModificarMotivoFieldProps {
  motivoOriginal: string | null;
  value: string;
  onChange: (nuevoMotivo: string) => void;
  error?: string;
}

const SUGERENCIAS_MOTIVO = [
  'Cambio de disponibilidad horaria del propietario',
  'Seguimiento a evolución de tratamiento previo',
  'Evaluación de nuevos síntomas observados',
  'Reprogramación por chequeo de rutina'
];

export const ModificarMotivoField: React.FC<ModificarMotivoFieldProps> = ({
  motivoOriginal,
  value,
  onChange,
  error
}) => {
  const minChars = 5;
  const maxChars = 500;
  const currentChars = value.length;

  const handleSugerenciaClick = (sugerencia: string) => {
    if (!value.trim()) {
      onChange(sugerencia);
    } else {
      onChange(`${value.trim()}. ${sugerencia}`);
    }
  };

  return (
    <div className="space-y-3">
      {/* Etiqueta y contador */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#0d9488]" />
          Motivo de la Cita / Observaciones
        </label>
        <span
          className={`text-xs font-medium ${
            currentChars > maxChars
              ? 'text-rose-600'
              : currentChars < minChars
              ? 'text-amber-600'
              : 'text-slate-400'
          }`}
        >
          {currentChars}/{maxChars} car. (mínimo {minChars})
        </span>
      </div>

      {/* Motivo previo */}
      {motivoOriginal && (
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600">
          <span className="font-semibold text-slate-700 block mb-0.5">Motivo registrado anteriormente:</span>
          <p className="italic text-slate-600">"{motivoOriginal}"</p>
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          value={value}
          maxLength={maxChars}
          placeholder="Describe la razón de la consulta o el motivo del cambio de cita..."
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#0d9488]/20 resize-none ${
            error
              ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
              : 'border-slate-200 bg-white text-slate-800 focus:border-[#0d9488]'
          }`}
        />
      </div>

      {/* Error de validación */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sugerencias rápidas */}
      <div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1.5">
          <HelpCircle className="w-3 h-3" />
          <span>Sugerencias rápidas:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGERENCIAS_MOTIVO.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleSugerenciaClick(sug)}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-slate-200 text-slate-600 transition-colors text-left"
            >
              + {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

