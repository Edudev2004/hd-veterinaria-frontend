import React, { useState } from "react";
import { X, PawPrint } from "lucide-react";
import { Mascota } from "@/services/petService";

interface PetDetailModalProps {
  mascota: Mascota;
  onClose: () => void;
  onEdit?: () => void;
}

const especieLabel: Record<string, string> = {
  perro: "Perro",
  gato: "Gato",
  otro: "Otro",
};
const sexoLabel: Record<string, string> = { macho: "Macho", hembra: "Hembra" };

export const PetDetailModal: React.FC<PetDetailModalProps> = ({
  mascota,
  onClose,
  onEdit,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center mb-4 mx-auto">
          {mascota.fotoUrl && !imgError ? (
            <img
              src={mascota.fotoUrl}
              alt={mascota.nombre}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <PawPrint className="w-8 h-8 text-slate-400" />
          )}
        </div>

        <h3 className="text-xl font-black text-slate-900 text-center font-outfit">
          {mascota.nombre}
        </h3>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Especie</span>
            <span className="font-semibold text-slate-900">
              {especieLabel[mascota.especie]}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Raza</span>
            <span className="font-semibold text-slate-900">
              {mascota.raza || "No especificada"}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Sexo</span>
            <span className="font-semibold text-slate-900">
              {sexoLabel[mascota.sexo]}
            </span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-slate-500">Fecha de nacimiento</span>
            <span className="font-semibold text-slate-900">
              {mascota.fechaNacimiento || "No especificada"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="mt-6 w-full py-3 rounded-xl bg-[#0D7C84] text-white font-bold text-sm hover:bg-[#0b686f] transition-colors"
        >
          Editar Mascota
        </button>
      </div>
    </div>
  );
};
