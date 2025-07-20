import React, { useState, useEffect, useContext } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';

const Home = () => {
  useUserAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      // No need to handle response since data is not displayed
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const fetchUserInfo = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      if (res.data && res.data.user) {
        updateUser(res.data.user);
      }
    } catch {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchUserInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        {loading ? (
          <div>Loading dashboard...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div></div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Home