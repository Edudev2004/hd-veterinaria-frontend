import { useState } from "react";
import { useStepperContext } from "../context/AppointmentStepperContext";
import { StepIndicator } from "./StepIndicator";
import { StepSpecialtySelection } from "./StepSpecialtySelection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepVetSelection } from "./StepVetSelection";
import { StepAvailabilitySelection } from "./StepAvailabilitySelection";
import { StepPetSelection } from "./StepPetSelection";
import { StepMotivo } from "./StepMotivo";
import { StepSummary } from "./StepSummary";
import { ConfirmationView } from "./ConfirmationView";
import {
  saveAppointment,
  isSlotAvailable,
  type Appointment,
} from "../services/appointmentService";

const steps = [
  { number: 1, label: "Especialidad" },
  { number: 2, label: "Veterinario" },
  { number: 3, label: "Horario" },
  { number: 4, label: "Mascota" },
  { number: 5, label: "Motivo" },
  { number: 6, label: "Resumen" },
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
    selectedPet,
    motivo,
    resetStepper,
  } = useStepperContext();

  const [savedAppointment, setSavedAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canNext = () => {
    if (currentStep === 1) return selectedSpecialty !== null;
    if (currentStep === 2) return selectedVet !== null;
    if (currentStep === 3) return selectedSlot !== null;
    if (currentStep === 4) return selectedPet !== null;
    if (currentStep === 5) return motivo.trim().length >= 3;
    return false;
  };

  const handleConfirm = () => {
    if (!selectedSpecialty || !selectedVet || !selectedPet || !selectedSlot)
      return;

    if (
      !isSlotAvailable(
        selectedVet.id,
        selectedSlot.date,
        selectedSlot.startTime,
      )
    ) {
      setError(
        "Este horario ya fue tomado por otro propietario. Volvé al paso 3 para elegir otro.",
      );
      return;
    }

    const appointment = saveAppointment({
      petId: selectedPet.id,
      petName: selectedPet.name,
      vetId: selectedVet.id,
      vetName: selectedVet.name,
      specialty: selectedSpecialty.name,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      motivo,
    });

    setSavedAppointment(appointment);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepSpecialtySelection />;
      case 2:
        return <StepVetSelection />;
      case 3:
        return <StepAvailabilitySelection />;
      case 4:
        return <StepPetSelection />;
      case 5:
        return <StepMotivo />;
      case 6:
        return <StepSummary />;
      default:
        return null;
    }
  };

  if (savedAppointment) {
    return (
      <ConfirmationView
        appointment={savedAppointment}
        onBackToList={() => {
          resetStepper();
          onBack();
        }}
      />
    );
  }

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

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setError(null);
            goToStep(Math.max(currentStep - 1, 1));
          }}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {currentStep < 6 ? (
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
            onClick={handleConfirm}
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
