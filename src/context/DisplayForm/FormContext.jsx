import React, { useState, createContext, useContext } from "react";

const FormContext = createContext();
export const FormDisplayProvider = ({ children }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [viewData, setViewData] = useState([]);
  const toggleForm = () => setIsFormOpen((prev) => !prev);
  const toggleInfo = () => setIsInfoOpen((prev) => !prev);




  return (
    <FormContext.Provider value={{ isFormOpen, setIsInfoOpen, toggleForm, isInfoOpen, toggleInfo, viewData, setViewData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
