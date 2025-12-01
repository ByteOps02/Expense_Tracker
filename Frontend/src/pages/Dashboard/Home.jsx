// Import necessary packages and components
import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
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
  const [dashboardData, setDashboardData] = useState(null);
  const { updateUser } = useContext(UserContext);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (res.data && res.data.user) {
          updateUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchDashboardData();
    fetchUserInfo();
  }, [updateUser]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="w-full max-w-[1400px] mx-auto px-6">
        {/* Top section with summary info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentTransactions
            transactions={dashboardData?.last5Transactions || []}
            onSeeMore={() => navigate("/expense")}
          />
          <ExpenseTransactions
            transactions={dashboardData?.expenseLast30Days || []}
            onSeeMore={() => navigate("/expense")}
          />
        </div>

        {/* Financial overview and last 30 days expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
          <Last30DaysExpenses
            data={dashboardData?.expenseLast30Days || []}
          />
        </div>

        {/* Recent income with chart and recent income list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentIncomeWithChart
            data={dashboardData?.incomeLast60Days?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncomeLast60Days || 0}
          />
          <RecentIncome
            transactions={dashboardData?.incomeLast60Days || []}
            onSeeMore={() => navigate("./income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;