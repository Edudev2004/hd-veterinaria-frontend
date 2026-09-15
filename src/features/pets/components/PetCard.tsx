import React from "react";
import { PawPrint } from "lucide-react";
import { Mascota } from "@/services/petService";

interface PetCardProps {
  mascota: Mascota;
  onClick: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ mascota, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#0D7C84] hover:shadow-md transition-all cursor-pointer"
    >
      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center mb-3">
        {mascota.fotoUrl ? (
          <img
            src={mascota.fotoUrl}
            alt={mascota.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <PawPrint className="w-6 h-6 text-slate-400" />
        )}
      </div>
      <h3 className="font-bold text-slate-900">{mascota.nombre}</h3>
      <p className="text-xs text-slate-500 capitalize">
        {mascota.especie} · {mascota.raza || "Sin raza especificada"}
      </p>
    </button>
  );
};
