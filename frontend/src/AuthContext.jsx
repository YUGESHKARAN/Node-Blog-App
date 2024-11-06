import React, { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  // Initialize isAuthenticated based on localStorage value
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true"); // Store login status
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // Clear login status
    localStorage.removeItem("username"); // Clear additional data if needed
    localStorage.removeItem("email");
  };

  useEffect(() => {
    // Optionally, you can check if the message in localStorage indicates a successful login
    const message = localStorage.getItem("message");
    if (message === "Login Successfull") {
      login(); // Set user as authenticated
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
