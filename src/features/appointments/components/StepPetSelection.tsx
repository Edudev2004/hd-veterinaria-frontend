import { useStepperContext } from "../context/AppointmentStepperContext";
import pets from "../mocks/pets.json";
import type { Pet } from "../types/appointment.types";

const typedPets: Pet[] = pets;

export const StepPetSelection = () => {
  const { setPet } = useStepperContext();

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {typedPets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => setPet(pet)}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#0d9488] hover:bg-teal-50/50 transition-all text-left group"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-slate-100 group-hover:border-[#0d9488]/30 transition-colors">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors">
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
        ))}
      </div>
    </div>
  );
};
