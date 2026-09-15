import { useStepperContext } from "../context/AppointmentStepperContext";
import { StepIndicator } from "./StepIndicator";
import { StepSpecialtySelection } from "./StepSpecialtySelection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepVetSelection } from "./StepVetSelection";

const steps = [
  { number: 1, label: "Especialidad" },
  { number: 2, label: "Veterinario" },
  { number: 3, label: "Horario" },
  { number: 4, label: "Resumen" },
];

interface StepperAppointmentProps {
  onBack: () => void;
}

function StepperAppointment({ onBack }: StepperAppointmentProps) {
  const {
    currentStep,
    goToStep,
    selectedSpecialty,
    selectedVet,
    selectedSlot,
  } = useStepperContext();

  const canNext = () => {
    if (currentStep === 1) return selectedSpecialty !== null;
    if (currentStep === 2) return selectedVet !== null;
    if (currentStep === 3) return selectedSlot !== null;
    return false;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepSpecialtySelection />;
      case 2:
        return <StepVetSelection />;
      case 3:
        return <div>Paso 3 - Horario</div>;
      case 4:
        return <div>Paso 4 - Resumen</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">
            Agendar Nueva Cita
          </h1>
          <p className="text-sm text-slate-500">
            Selecciona la especialidad, veterinario y horario
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goToStep(Math.max(currentStep - 1, 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {currentStep < 4 ? (
          <button
            onClick={() => goToStep(currentStep + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-xl transition-colors"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => console.log("Agendar cita")}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#f59e0b] hover:bg-[#d97706] rounded-xl transition-colors"
          >
            Agendar Cita
          </button>
        )}
      </div>
    </div>
  );
}

export default StepperAppointment;
