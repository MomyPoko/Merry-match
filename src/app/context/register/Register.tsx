import React, { createContext, useContext, useState, ReactNode } from "react";

interface FormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  allData: FormDataType;
  updateFormData: (newData: Partial<FormDataType>) => void;
}

interface FormDataType {
  name: string;
  dateOfBirth: string;
  country: string;
  state: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  // sexIdent: string;
  // sexPref: string;
  // recailPref: string;
  // meeting: string;
  image: { [key: number]: string };
}

export const FormContext = createContext<FormContextType | any>(undefined);

export function useFormContext(): FormContextType {
  return useContext(FormContext);
}

export const FormRegister: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [allData, setAllData] = useState<FormDataType>({
    name: "",
    dateOfBirth: "",
    country: "",
    state: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // sexIdent: "",
    // sexPref: "",
    // recailPref: "",
    // meeting: "",
    image: { 1: "", 2: "", 3: "", 4: "", 5: "" },
  });

  const updateFormData = (newData: Partial<FormDataType>) => {
    setAllData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <FormContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        allData,
        updateFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
