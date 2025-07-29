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
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from './Last30DaysExpenses.jsx';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';
import SkeletonLoader from '../../components/SkeletonLoader';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const { updateUser } = useContext(UserContext);

  const fetchDashboardData = async () => {
    if (loading && dashboardData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      setDashboardData(res.data);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      if (res.data && res.data.user) {
        updateUser(res.data.user);
      }
    } catch (err) {
      console.error("User info fetch error:", err);
      // Don't set error here as it's not critical for dashboard display
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchUserInfo();
    // eslint-disable-next-line
  }, []);

  const handleRetry = () => {
    fetchDashboardData();
  };

  if (error) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuHandCoins className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <ErrorBoundary>
        <div className='flex flex-col items-center w-full lg:ml-2.5'>
          <div className="w-full max-w-7xl flex flex-col items-center gap-y-8">
            {/* Info Cards Section */}
            <div className="w-full flex flex-row flex-wrap justify-between gap-x-8 gap-y-8 animate-fadeIn">
              {loading ? (
                <>
                  <SkeletonLoader type="card" />
                  <SkeletonLoader type="card" />
                  <SkeletonLoader type="card" />
                </>
              ) : (
                <>
                  <InfoCard
                    icon={<MdAccountBalanceWallet />}
                    label="Total Balance"
                    value={"₹" + addThousandsSeparator(dashboardData?.balance ?? 0)}
                    color="bg-purple-500"
                  />
                  <InfoCard
                    icon={<LuWalletMinimal />}
                    label="Total Income"
                    value={"₹" + addThousandsSeparator(dashboardData?.allIncomes?.reduce((sum, i) => sum + i.amount, 0) ?? 0)}
                    color="bg-orange-500"
                  />
                  <InfoCard
                    icon={<LuHandCoins />}
                    label="Total Expense"
                    value={"₹" + addThousandsSeparator(dashboardData?.allExpenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0)}
                    color="bg-red-500"
                  />
                </>
              )}
            </div>

            {/* Recent Transactions Section */}
            <div className="w-full flex flex-col md:flex-row gap-8 animate-slideIn">
              <div className="w-full md:w-1/2 flex flex-col gap-8">
                {loading ? (
                  <SkeletonLoader type="list" lines={5} />
                ) : (
                  <RecentTransactions
                    transactions={dashboardData?.last5Transactions || []}
                    onSeeMore={() => navigate("/expense")} 
                  />
                )}
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-8">
                {loading ? (
                  <SkeletonLoader type="list" lines={5} />
                ) : (
                  <ExpenseTransactions
                    transactions={dashboardData?.expenseLast30Days || []}
                    onSeeMore={() => navigate("/expense")}
                  />
                )}
              </div>
            </div>

            {/* Financial Overview and Last 30 Days Expenses */}
            <div className="w-full flex flex-col md:flex-row gap-8 mt-4">
              <div className="w-full md:w-1/2">
                {loading ? (
                  <SkeletonLoader type="chart" />
                ) : (
                  <FinanceOverview
                    totalBalance={dashboardData?.balance ?? 0}
                    totalIncome={dashboardData?.allIncomes?.reduce((sum, i) => sum + i.amount, 0) ?? 0}
                    totalExpense={dashboardData?.allExpenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0}
                  />
                )}
              </div>
              <div className="w-full md:w-1/2">
                {loading ? (
                  <SkeletonLoader type="chart" />
                ) : (
                  <Last30DaysExpenses data={dashboardData?.expenseLast30Days || []} />
                )}
              </div>
            </div>

            {/* Last 60 Days Income and Income cards */}
            <div className="w-full flex flex-col md:flex-row gap-8 mt-4">
              <div className="w-full md:w-1/2">
                {loading ? (
                  <SkeletonLoader type="chart" />
                ) : (
                  <RecentIncomeWithChart
                    data={dashboardData?.incomeLast60Days?.slice(0, 4) || []}
                    totalIncome={dashboardData?.totalIncomeLast60Days || 0}
                  />
                )}
              </div>
              <div className="w-full md:w-1/2">
                {loading ? (
                  <SkeletonLoader type="list" lines={5} />
                ) : (
                  <RecentIncome
                    transactions={dashboardData?.incomeLast60Days || []}
                    onSeeMore={() => navigate("./income")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
}

export default Home;