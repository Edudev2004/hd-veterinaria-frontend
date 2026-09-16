import React, { useEffect, useState } from "react";
import { PawPrint, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PetForm } from "../components/PetForm";
import { PetCard } from "../components/PetCard";
import { PetDetailModal } from "../components/PetDetailModal";
import { HistorialClinicoModal } from "../components/HistorialClinicoModal";
import { getMyPets, Mascota } from "@/services/petService";

export const PetsPage: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);
  const [mascotaParaHistorial, setMascotaParaHistorial] = useState<Mascota | null>(null);

  useEffect(() => {
    setMascotas(getMyPets());
  }, []);

  const handleSuccess = () => {
    setMascotas(getMyPets());
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">
            Mis Mascotas
          </h1>
          <p className="text-sm text-slate-500">
            Gestión de expedientes y registros de pacientes
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          {showForm ? "Cancelar" : "Añadir Mascota"}
        </Button>
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white max-w-md">
          <PetForm onSuccess={handleSuccess} />
        </div>
      )}

      {mascotas.length === 0 ? (
        <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <PawPrint className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Aún no tienes mascotas registradas
          </h3>
          <p className="text-xs text-slate-500 max-w-md">
            Registra tu primera mascota para empezar a agendar citas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mascotas.map((mascota) => (
            <PetCard
              key={mascota.id}
              mascota={mascota}
              onClick={() => setSelectedMascota(mascota)}
              onVerHistorial={(m) => setMascotaParaHistorial(m)}
            />
          ))}
        </div>
      )}

      {selectedMascota && (
        <PetDetailModal
          mascota={selectedMascota}
          onClose={() => setSelectedMascota(null)}
          onVerHistorial={(m) => setMascotaParaHistorial(m)}
        />
      )}

      {mascotaParaHistorial && (
        <HistorialClinicoModal
          isOpen={Boolean(mascotaParaHistorial)}
          onClose={() => setMascotaParaHistorial(null)}
          mascotaId={mascotaParaHistorial.id}
          mascotaNombre={mascotaParaHistorial.nombre}
        />
      )}
    </div>
  );
};
