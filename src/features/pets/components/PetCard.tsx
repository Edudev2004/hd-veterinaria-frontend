import React, { useState } from "react";
import { PawPrint, ClipboardList, ChevronRight } from "lucide-react";
import { Mascota } from "@/services/petService";

interface PetCardProps {
  mascota: Mascota;
  onClick: () => void;
  onVerHistorial?: (mascota: Mascota) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ mascota, onClick, onVerHistorial }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
      <button
        type="button"
        onClick={onClick}
        className="text-left w-full cursor-pointer focus:outline-none"
      >
        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
          {mascota.fotoUrl && !imgError ? (
            <img
              src={mascota.fotoUrl}
              alt={mascota.nombre}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <PawPrint className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <h3 className="font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors">
          {mascota.nombre}
        </h3>
        <p className="text-xs text-slate-500 capitalize">
          {mascota.especie} · {mascota.raza || "Sin raza especificada"}
        </p>
      </button>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onClick}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <span>Ficha</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        {onVerHistorial && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVerHistorial(mascota);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0d9488] hover:text-white bg-teal-50 hover:bg-[#0d9488] border border-teal-200 hover:border-[#0d9488] rounded-xl transition-all shadow-xs active:scale-95"
            title={`Consultar historial clínico de ${mascota.nombre}`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Historial Clínico</span>
          </button>
        )}
      </div>
    </div>
  );
};
