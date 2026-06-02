// Import necessary packages and components
import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/UserContextDefinition";
import InfoCard from "../../components/Cards/InfoCard";
import {
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import { addThousandsSeparator } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "./Last30DaysExpenses.jsx";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import MonthSelector from "../../components/Dashboard/MonthSelector";

// Home component for the dashboard
const Home = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser, selectedMonth, setSelectedMonth } = useContext(UserContext);

  // Format month to YYYY-MM format
  const getFormattedMonth = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // Fetch default dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
        setDashboardData(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [updateUser]);

  // Fetch monthly data when selected month changes
  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true);
      try {
        const formattedMonth = getFormattedMonth(selectedMonth);
        const res = await axiosInstance.get(
          `${API_PATHS.DASHBOARD.GET_MONTHLY_SUMMARY}?month=${formattedMonth}`
        );
        setMonthlyData(res.data.data);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
        setMonthlyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [selectedMonth]);

  const handleMonthChange = (newDate) => {
    setSelectedMonth(newDate);
  };

  // Use monthly data if available, otherwise fall back to dashboard data
  const displayData = monthlyData || dashboardData;
  const monthName = selectedMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Month Selector */}
        <div className="mb-8">
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Top section with summary info cards */}
        <div className="stagger-children flex md:grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 no-scrollbar snap-x snap-mandatory">
          <InfoCard
            icon={<MdAccountBalanceWallet />}
            label="Total Income"
            value={
              "₹" +
              addThousandsSeparator(
                monthlyData?.totalIncome ?? dashboardData?.totalIncome ?? 0
              )
            }
            color="bg-orange-500"
          />
          <InfoCard
            icon={<MdTrendingDown />}
            label="Total Expense"
            value={
              "₹" +
              addThousandsSeparator(
                monthlyData?.totalExpense ?? dashboardData?.totalExpense ?? 0
              )
            }
            color="bg-red-500"
          />
          <InfoCard
            icon={<MdTrendingUp />}
            label="Total Savings / Balance"
            value={
              monthlyData
                ? "₹" + addThousandsSeparator(monthlyData?.totalSavings ?? 0)
                : "₹" + addThousandsSeparator(dashboardData?.balance ?? 0)
            }
            color="bg-purple-500"
          />
        </div>

        {/* Middle section with lists and overview */}
        <div className="stagger-children delay-150 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column: Transactions & Income lists */}
          <div className="flex flex-col gap-6">
            <RecentTransactions
              transactions={
                monthlyData?.monthlyTransactions?.slice(0, 5) ||
                dashboardData?.last5Transactions ||
                []
              }
              onSeeMore={() => navigate("/recent-transactions")}
            />
            <RecentIncome
              transactions={
                monthlyData?.monthlyTransactions?.filter((t) => t.type === "income") ||
                dashboardData?.incomeLast30Days ||
                []
              }
              onSeeMore={() => navigate("/income")}
              className="lg:min-h-[520px]"
            />
          </div>

          {/* Right Column: Expenses list & Finance Overview */}
          <div className="flex flex-col gap-6">
            <ExpenseTransactions
              transactions={
                monthlyData?.monthlyTransactions?.filter((t) => t.type === "expense") ||
                dashboardData?.expenseLast30Days ||
                []
              }
              onSeeMore={() => navigate("/expense")}
            />
            <FinanceOverview
              totalBalance={
                monthlyData?.totalSavings ??
                dashboardData?.balance ??
                0
              }
              totalIncome={
                monthlyData?.totalIncome ?? dashboardData?.totalIncome ?? 0
              }
              totalExpense={
                monthlyData?.totalExpense ?? dashboardData?.totalExpense ?? 0
              }
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="stagger-children delay-300 flex lg:grid lg:grid-cols-2 gap-6 mb-8 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar snap-x snap-mandatory">
          <RecentIncomeWithChart
            data={
              monthlyData?.monthlyTransactions
                ?.filter((t) => t.type === "income")
                ?.slice(0, 4) ||
              dashboardData?.incomeLast30Days?.slice(0, 4) ||
              []
            }
            totalIncome={monthlyData?.totalIncome ?? dashboardData?.totalIncomeLast30Days ?? 0}
          />
          <Last30DaysExpenses
            data={
              monthlyData?.monthlyTransactions?.filter(
                (t) => t.type === "expense"
              ) || dashboardData?.expenseLast30Days || []
            }
          />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Home;