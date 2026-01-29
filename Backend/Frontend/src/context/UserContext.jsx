import React, { useState, useCallback, useEffect } from "react";
import { UserContext } from "./UserContextDefinition";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (response?.data?.data?.user) {
          setUser(response.data.data.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        // Token might be invalid, so clear it
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

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
    localStorage.removeItem("token");
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;