import { useStepperContext } from "../context/AppointmentStepperContext";
import { Stethoscope } from "lucide-react";

const specialties = [
  {
    id: 1,
    name: "Cardiología",
    description:"Especialidad en enfermedades del corazón y sistema circulatorio",
  },
  {
    id: 2,
    name: "Dermatología",
    description: "Tratamiento de enfermedades de la piel, pelo y uñas",
  },
  {
    id: 3,
    name: "Oftalmología",
    description: "Cuidado y tratamiento de enfermedades de los ojos",
  },
  {
    id: 4,
    name: "Traumatología",
    description: "Tratamiento de lesiones del sistema musculoesquelético",
  },
  {
    id: 5,
    name: "Odontología",
    description: "Salud bucal y tratamiento dental para mascotas",
  },
];

export const StepSpecialtySelection = () => {
  const { setSpecialty } = useStepperContext();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Selecciona una Especialidad
        </h2>
        <p className="text-sm text-slate-500">
          Elige la especialidad que necesita tu mascota
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {specialties.map((specialty) => (
          <button
            key={specialty.id}
            onClick={() => setSpecialty(specialty)}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#0d9488] hover:bg-teal-50/50 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-[#0d9488]/10 flex items-center justify-center flex-shrink-0 transition-colors">
              <Stethoscope className="w-5 h-5 text-slate-400 group-hover:text-[#0d9488] transition-colors" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors">
                {specialty.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {specialty.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
