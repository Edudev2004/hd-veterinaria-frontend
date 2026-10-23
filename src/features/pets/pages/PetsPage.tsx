import React, { useEffect, useState } from "react";
import { AlertCircle, PawPrint, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PetForm } from "../components/PetForm";
import { PetCard } from "../components/PetCard";
import { PetDetailModal } from "../components/PetDetailModal";
import { HistorialClinicoModal } from "../components/HistorialClinicoModal";
import { getMyPets } from "@/services/petApi";
import { Mascota } from "@/services/petService";

export const PetsPage: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMascota, setEditingMascota] = useState<Mascota | null>(null);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);
  const [mascotaParaHistorial, setMascotaParaHistorial] = useState<Mascota | null>(null);

  const loadMascotas = async () => {
    try {
      setMascotas(await getMyPets());
      setLoadError(null);
    } catch (err: any) {
      setLoadError(err?.message || "No se pudieron cargar las mascotas.");
    }
  };

  useEffect(() => {
    loadMascotas();
  }, []);

  const handleSuccess = () => {
    loadMascotas();
    setShowForm(false);
    setEditingMascota(null);
  };

  const handleAddClick = () => {
    setEditingMascota(null);
    setShowForm(!showForm);
  };

  const handleEditClick = () => {
    setEditingMascota(selectedMascota);
    setSelectedMascota(null);
    setShowForm(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">
            Mis Mascotas
          </h1>
          <p className="text-sm text-slate-500">
            Gestión de expedientes y registros de pacientes
          </p>
        </div>
        <Button
          variant={showForm ? "outline" : "primary"}
          onClick={handleAddClick}
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Añadir Mascota
            </>
          )}
        </Button>
      </div>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-600 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Si el formulario está abierto, organizamos en dos columnas: Formulario a la izquierda y Mascotas a la derecha */}
      {showForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 font-outfit">
                  {editingMascota ? "Editar Mascota" : "Registrar Nueva Mascota"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMascota(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Cerrar
                </button>
              </div>
              <PetForm
                mascota={editingMascota ?? undefined}
                onSuccess={handleSuccess}
              />
            </div>
          </div>

          {/* Columna Derecha: Mascotas registradas */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Mascotas Registradas ({mascotas.length})
              </h2>
            </div>

            {mascotas.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                  <PawPrint className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Aún no tienes mascotas registradas
                </h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Completa el formulario de la izquierda para registrar a tu primera mascota.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
        </div>
      ) : (
        /* Vista sin formulario: Grid amplio de tarjetas de mascotas */
        <>
          {mascotas.length === 0 && !loadError ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        </>
      )}

      {/* Modales */}
      {selectedMascota && (
        <PetDetailModal
          mascota={selectedMascota}
          onClose={() => setSelectedMascota(null)}
          onEdit={handleEditClick}
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
