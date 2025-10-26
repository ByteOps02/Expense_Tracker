// Import necessary packages and components
import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/UserContext";
import InfoCard from "../../components/Cards/InfoCard";
import { MdAccountBalanceWallet } from "react-icons/md";
import { addThousandsSeparator } from "../../utils/helper";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "./Last30DaysExpenses.jsx";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

// Home component for the dashboard
const Home = () => {
  // Custom hook to ensure user is authenticated
  useUserAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const { updateUser } = useContext(UserContext);

  /**
   * @desc    Fetches the main dashboard data from the API
   */
  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      setDashboardData(res.data);
    } catch {
      // Silently handle error, as specific error handling is not required here
    }
    setLoading(false);
  };

  /**
   * @desc    Fetches the latest user information
   */
  const fetchUserInfo = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      if (res.data && res.data.user) {
        updateUser(res.data.user);
      }
    } catch {
      // Silently handle error
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchUserInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="flex flex-col items-center w-full lg:ml-2.5">
        <div className="w-full max-w-7xl flex flex-col items-center gap-y-8">
          {/* Top section with summary info cards */}
          <div className="w-full flex flex-row flex-wrap justify-between gap-x-8 gap-y-8 animate-fadeIn">
            <InfoCard
              icon={<MdAccountBalanceWallet />}
              label="Total Balance"
              value={"₹" + addThousandsSeparator(dashboardData?.balance ?? 0)}
              color="bg-purple-500"
            />
            <InfoCard
              icon={<LuWalletMinimal />}
              label="Total Income"
              value={
                "₹" +
                addThousandsSeparator(
                  dashboardData?.allIncomes?.reduce(
                    (sum, i) => sum + i.amount,
                    0,
                  ) ?? 0,
                )
              }
              color="bg-orange-500"
            />
            <InfoCard
              icon={<LuHandCoins />}
              label="Total Expense"
              value={
                "₹" +
                addThousandsSeparator(
                  dashboardData?.allExpenses?.reduce(
                    (sum, e) => sum + e.amount,
                    0,
                  ) ?? 0,
                )
              }
              color="bg-red-500"
            />
          </div>

          {/* Middle section with recent transactions and expenses */}
          <div className="w-full flex flex-col md:flex-row gap-8 animate-slideIn">
            <div className="flex-1 flex flex-col gap-8">
              <RecentTransactions
                transactions={dashboardData?.last5Transactions || []}
                onSeeMore={() => navigate("/expense")}
              />
            </div>
            <div className="flex-1 flex flex-col gap-8">
              <ExpenseTransactions
                transactions={dashboardData?.expenseLast30Days || []}
                onSeeMore={() => navigate("/expense")}
              />
            </div>
          </div>

          {/* Financial overview and last 30 days expenses */}
          <div className="w-full flex flex-col md:flex-row gap-8 mt-4">
            <div className="w-full md:w-1/2">
              <FinanceOverview
                totalBalance={dashboardData?.balance ?? 0}
                totalIncome={
                  dashboardData?.allIncomes?.reduce(
                    (sum, i) => sum + i.amount,
                    0,
                  ) ?? 0
                }
                totalExpense={
                  dashboardData?.allExpenses?.reduce(
                    (sum, e) => sum + e.amount,
                    0,
                  ) ?? 0
                }
              />
            </div>
            <div className="w-full md:w-1/2">
              <Last30DaysExpenses
                data={dashboardData?.expenseLast30Days || []}
              />
            </div>
          </div>

          {/* Recent income with chart and recent income list */}
          <div className="w-full flex flex-col md:flex-row gap-8 mt-4">
            <div className="w-full md:w-1/2">
              <RecentIncomeWithChart
                data={dashboardData?.incomeLast60Days?.slice(0, 4) || []}
                totalIncome={dashboardData?.totalIncomeLast60Days || 0}
              />
            </div>
            <div className="w-full md:w-1/2">
              <RecentIncome
                transactions={dashboardData?.incomeLast60Days || []}
                onSeeMore={() => navigate("./income")}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;