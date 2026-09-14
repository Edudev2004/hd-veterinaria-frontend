import { createContext, useContext } from "react";

const AppointmentStepperContext = createContext(undefined);


//Hook perzonalizado
export const useStepperContext = () => {
  return useContext(AppointmentStepperContext);
};
