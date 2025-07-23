import React, { useState, useEffect, useContext } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';
import InfoCard from '../../components/Cards/InfoCard';
import { IoMdCard } from 'react-icons/io';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { addThousandsSeparator } from '../../utils/helper';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const { updateUser } = useContext(UserContext);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      setDashboardData(res.data);
    } catch {
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
      <div className='my-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 animate-fadeIn">Dashboard Overview</h2>
        {loading && <div className="text-center text-gray-500 py-8">Loading...</div>}
        {error && <div className="text-red-500 text-center py-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 animate-fadeIn">
          <InfoCard
            icon={<MdAccountBalanceWallet />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance ?? 0)}
            color="bg-purple-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome ?? 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpense ?? 0)}
            color="bg-red-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideIn">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")} />
          {/* You can add more dashboard widgets here in the future */}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Home 