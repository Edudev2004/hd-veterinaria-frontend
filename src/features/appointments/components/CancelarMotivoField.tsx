import React from 'react';
import { FileText, AlertCircle, HelpCircle, Tag } from 'lucide-react';
import { MotivoCancelacionCategoria } from '../../../types/cita.types';
import { MOTIVOS_CANCELACION_PRESET } from '../../../services/citaService';

interface CancelarMotivoFieldProps {
  motivoOriginal: string | null;
  categoriaSeleccionada: MotivoCancelacionCategoria | null;
  onSelectCategoria: (cat: MotivoCancelacionCategoria) => void;
  motivoTexto: string;
  onChangeMotivoTexto: (nuevoTexto: string) => void;
  error?: string;
}

export const CancelarMotivoField: React.FC<CancelarMotivoFieldProps> = ({
  motivoOriginal,
  categoriaSeleccionada,
  onSelectCategoria,
  motivoTexto,
  onChangeMotivoTexto,
  error
}) => {
  const minChars = 5;
  const maxChars = 500;
  const currentChars = motivoTexto.length;

  const handleChipClick = (presetId: MotivoCancelacionCategoria, presetTitulo: string) => {
    onSelectCategoria(presetId);
    if (!motivoTexto.trim() || motivoTexto === presetTitulo) {
      onChangeMotivoTexto(presetTitulo);
    }
  };

  return (
    <div className="space-y-4">
      {/* Motivo original de la cita para contexto */}
      {motivoOriginal && (
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600">
          <span className="font-semibold text-slate-700 block mb-1">
            Motivo original con el que se agendó:
          </span>
          <p className="italic text-slate-600 bg-white/70 p-2 rounded-xl border border-slate-100">
            "{motivoOriginal}"
          </p>
        </div>
      )}

      {/* Selector de categorías o motivos predefinidos */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          <Tag className="w-3.5 h-3.5 text-rose-500" />
          <span>Selecciona un motivo común de cancelación</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MOTIVOS_CANCELACION_PRESET.map((preset) => {
            const isSelected = categoriaSeleccionada === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleChipClick(preset.id, preset.titulo)}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col gap-0.5 ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/70 text-rose-900 ring-2 ring-rose-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="font-semibold text-slate-900 flex items-center justify-between">
                  {preset.titulo}
                  {isSelected && <span className="text-rose-600 text-[10px] font-bold">✓ Seleccionado</span>}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-1">
                  {preset.descripcion}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalle o justificación en texto */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>Detalle o Justificación obligatoria</span>
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

        <div className="relative">
          <textarea
            rows={3}
            value={motivoTexto}
            maxLength={maxChars}
            placeholder="Explica brevemente la razón por la que necesitas cancelar la cita médica..."
            onChange={(e) => onChangeMotivoTexto(e.target.value)}
            className={`w-full p-3.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 resize-none ${
              error
                ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-200 bg-white text-slate-800 focus:border-rose-400 focus:ring-rose-100'
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

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
          <span>
            Esta información quedará registrada en el historial médico de la cita y notificará al veterinario.
          </span>
        </div>
      </div>
    </div>
  );
};

