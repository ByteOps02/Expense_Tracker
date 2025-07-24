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
      // setError("Something went wrong. Please try again."); // This line was removed
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
      <div className='flex flex-col items-center w-full'>
        <div className="w-full max-w-7xl flex flex-col items-center">
          <div className="w-full flex flex-row justify-between gap-8 mb-14 animate-fadeIn">
            <InfoCard
              icon={<MdAccountBalanceWallet />}
              label="Total Balance"
              value={addThousandsSeparator(dashboardData?.balance ?? 0)}
              color="bg-purple-500"
              cardWidth="w-[370px]"
            />
            <InfoCard
              icon={<LuWalletMinimal />}
              label="Total Income"
              value={addThousandsSeparator(dashboardData?.allIncomes?.reduce((sum, i) => sum + i.amount, 0) ?? 0)}
              color="bg-orange-500"
              cardWidth="w-[370px]"
            />
            <InfoCard
              icon={<LuHandCoins />}
              label="Total Expense"
              value={addThousandsSeparator(dashboardData?.allExpenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0)}
              color="bg-red-500"
              cardWidth="w-[370px]"
            />
          </div>
          <div className="w-full flex justify-start animate-slideIn">
            <div className="w-full md:w-4/5 lg:w-2/5">
              <RecentTransactions
                transactions={dashboardData?.recentTransactions}
                onSeeMore={() => navigate("/expense")} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Home 