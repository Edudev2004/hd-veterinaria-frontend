import { createContext, useContext, useReducer } from "react";
import type {
  StepperState,
  Action,
  StepperContextType,
  ProviderProps,
  Specialty,
  Veterinarian,
  Pet,
  AvailabilitySlot,
} from "../types/appointment.types";

const AppointmentStepperContext = createContext<StepperContextType | undefined>(undefined);

export const useStepperContext = () => {
  const context = useContext(AppointmentStepperContext);
  if (!context) {
    throw new Error("useStepperContext debe usarse dentro de AppointmentStepperProvider");
  }
  return context;
};

const initialState: StepperState = {
  currentStep: 1,
  selectedSpecialty: null,
  selectedVet: null,
  selectedPet: null,
  selectedSlot: null,
  motivo: "",
};

const reducer = (state: StepperState, action: Action): StepperState => {
  switch (action.type) {
    case "SET_SPECIALTY":
      return { ...state, selectedSpecialty: action.payload, currentStep: 2 };
    case "SET_VET":
      return { ...state, selectedVet: action.payload, currentStep: 3 };
    case "SET_PET":
      return { ...state, selectedPet: action.payload };
    case "SET_SLOT":
      return { ...state, selectedSlot: action.payload, currentStep: 4 };
    case "SET_MOTIVO":
      return { ...state, motivo: action.payload };
    case "GO_TO_STEP":
      return { ...state, currentStep: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const AppointmentStepperProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSpecialty = (specialty: Specialty) => dispatch({ type: "SET_SPECIALTY", payload: specialty });
  const setVet = (vet: Veterinarian) => dispatch({ type: "SET_VET", payload: vet });
  const setPet = (pet: Pet) => dispatch({ type: "SET_PET", payload: pet });
  const setSlot = (slot: AvailabilitySlot) => dispatch({ type: "SET_SLOT", payload: slot });
  const setMotivo = (motivo: string) => dispatch({ type: "SET_MOTIVO", payload: motivo });
  const goToStep = (step: number) => dispatch({ type: "GO_TO_STEP", payload: step });
  const resetStepper = () => dispatch({ type: "RESET" });

  return (
    <AppointmentStepperContext.Provider
      value={{ ...state, setSpecialty, setVet, setPet, setSlot, setMotivo, goToStep, resetStepper }}
    >
      {children}
    </AppointmentStepperContext.Provider>
  );
};
