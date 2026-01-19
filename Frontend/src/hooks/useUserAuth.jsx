import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContextDefinition";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
        return;
      }

      if (!user || !user.fullName) {
        try {
          const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
          if (isMounted && response?.data?.user) {
            updateUser(response.data.user);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error fetching user info:", error);
            clearUser();
            navigate("/login");
          }
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser, navigate]);
};