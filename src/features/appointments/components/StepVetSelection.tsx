import { useStepperContext } from "../context/AppointmentStepperContext";
import { User, Star } from "lucide-react";
import veterinarians from "../mocks/veterinarians.json";

export const StepVetSelection = () => {
  const { selectedSpecialty, setVet } = useStepperContext();

  const filteredVets = veterinarians.filter(
    (vet) => vet.specialty === selectedSpecialty?.name,
  );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-3.5 h-3.5 fill-amber-400/50 text-amber-400"
        />,
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Veterinarios de {selectedSpecialty?.name}
        </h2>
        <p className="text-sm text-slate-500">
          Selecciona al veterinario que atenderá a tu mascota
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredVets.map((vet) => (
          <button
            key={vet.id}
            onClick={() => setVet(vet)}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#0d9488] hover:bg-teal-50/50 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#0d9488]/10 flex items-center justify-center flex-shrink-0 transition-colors">
              <User className="w-6 h-6 text-slate-400 group-hover:text-[#0d9488] transition-colors" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors">
                {vet.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{vet.specialty}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {renderStars(vet.averageRating)}
                <span className="text-xs font-medium text-slate-600 ml-1">
                  {vet.averageRating}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
