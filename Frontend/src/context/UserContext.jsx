// Import necessary packages
import React, { useState, useCallback } from "react";
import { UserContext } from "./UserContextDefinition";

// Create a provider component for the UserContext
const UserProvider = ({ children }) => {
  // State to store the user data
  const [user, setUser] = useState(null);

  /**
   * @desc    Function to update the user data in the context
   * @param   {object} userData - The new user data
   */
  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  /**
   * @desc    Function to clear the user data from the context
   */
  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  return (
    // Provide the user data and functions to the children components
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;