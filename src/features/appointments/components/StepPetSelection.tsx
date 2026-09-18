import { useStepperContext } from "../context/AppointmentStepperContext";
import { getMyPets } from "@/services/petService";
import type { Pet } from "../types/appointment.types";
import { PawPrint } from "lucide-react";

const DEFAULT_PET_IMAGE = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80";

const calcularEdad = (fechaNacimiento?: string): number => {
  if (!fechaNacimiento) return 0;
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = nacimiento.getMonth();
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return Math.max(0, edad);
};

const mapMascotaToPet = (mascota: ReturnType<typeof getMyPets>[number]): Pet => ({
  id: mascota.id,
  name: mascota.nombre,
  species: mascota.especie.charAt(0).toUpperCase() + mascota.especie.slice(1),
  breed: mascota.raza || "Sin raza",
  age: calcularEdad(mascota.fechaNacimiento),
  image: mascota.fotoUrl || DEFAULT_PET_IMAGE,
});

export const StepPetSelection = () => {
  const { selectedPet, setPet } = useStepperContext();
  const mascotas = getMyPets();
  const pets: Pet[] = mascotas.map(mapMascotaToPet);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Selecciona la Mascota
        </h2>
        <p className="text-sm text-slate-500">
          Elige para quién es la cita
        </p>
      </div>

      {pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <PawPrint className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-500">
            No tienes mascotas registradas
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Primero agrega una mascota desde "Mis Mascotas"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pets.map((pet) => {
            const isSelected = selectedPet?.id === pet.id;
            return (
              <button
                key={pet.id}
                onClick={() => setPet(pet)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
                  isSelected
                    ? "border-[#0d9488] bg-teal-50 ring-2 ring-teal-200"
                    : "border-slate-200 hover:border-[#0d9488] hover:bg-teal-50/50"
                }`}
              >
                <div className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  isSelected
                    ? "border-[#0d9488]"
                    : "border-slate-100 group-hover:border-[#0d9488]/30"
                }`}>
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-sm font-bold transition-colors ${
                    isSelected
                      ? "text-[#0d9488]"
                      : "text-slate-900 group-hover:text-[#0d9488]"
                  }`}>
                    {pet.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {pet.species} &bull; {pet.breed}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {pet.age} {pet.age === 1 ? "año" : "años"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
