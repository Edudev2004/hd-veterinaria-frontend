import { ReactNode } from "react";

export interface Specialty {
  id: number;
  name: string;
  description: string;
}

export interface Veterinarian {
  id: number;
  name: string;
  specialty: string;
  averageRating: number;
}

export interface Pet {
  id: string | number;
  name: string;
  species: string;
  breed: string;
  age: number;
  image: string;
}

export type SlotStatus = "available" | "occupied";

export interface AvailabilitySlot {
  id: number;
  vetId: number;
  date: string;
  startTime: string;
  status: SlotStatus;
  appointmentId?: string;
}

export interface StepperState {
  currentStep: number;
  selectedSpecialty: Specialty | null;
  selectedVet: Veterinarian | null;
  selectedPet: Pet | null;
  selectedSlot: AvailabilitySlot | null;
  motivo: string;
}

export type Action =
  | { type: "SET_SPECIALTY"; payload: Specialty }
  | { type: "SET_VET"; payload: Veterinarian }
  | { type: "SET_PET"; payload: Pet }
  | { type: "SET_SLOT"; payload: AvailabilitySlot }
  | { type: "SET_MOTIVO"; payload: string }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "RESET" };

export interface StepperContextType extends StepperState {
  setSpecialty: (specialty: Specialty) => void;
  setVet: (vet: Veterinarian) => void;
  setPet: (pet: Pet) => void;
  setSlot: (slot: AvailabilitySlot) => void;
  setMotivo: (motivo: string) => void;
  goToStep: (step: number) => void;
  resetStepper: () => void;
}

export interface ProviderProps {
  children: ReactNode;
}
