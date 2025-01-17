import React, { createContext, useState } from "react";

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [notification, setNotification] = useState([]);

  return (
    <GlobalStateContext.Provider value={{notification, setNotification }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
