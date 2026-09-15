import { createContext, useContext, useReducer } from "react";

const AppointmentStepperContext = createContext(undefined);

//Hook perzonalizado
export const useStepperContext = () => {
  return useContext(AppointmentStepperContext);
};

const initialState = {
  currentStep: 1,
  selectedSpecialty: null,
  selectedVet: null,
  selectedSlot: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SPECIALTY":
      return { ...state, selectedSpecialty: action.payload, currentStep: 2 };
    case "SET_VET":
      return { ...state, selectedVet: action.payload, currentStep: 3 };
    case "SET_SLOT":
      return { ...state, selectedSlot: action.payload, currentStep: 4 };
    case "GO_TO_STEP":
      return { ...state, currentStep: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const AppointmentStepperProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSpecialty = (specialty) => dispatch({ type: "SET_SPECIALTY", payload: specialty });
  const setVet = (vet) => dispatch({ type: "SET_VET", payload: vet });
  const setSlot = (slot) => dispatch({ type: "SET_SLOT", payload: slot });
  const goToStep = (step) => dispatch({ type: "GO_TO_STEP", payload: step });
  const resetStepper = () => dispatch({ type: "RESET" });

  return (
    <AppointmentStepperContext.Provider
      value={{
        ...state,
        setSpecialty,
        setVet,
        setSlot,
        goToStep,
        resetStepper,
      }}
    >
      {children}
    </AppointmentStepperContext.Provider>
  );
};
