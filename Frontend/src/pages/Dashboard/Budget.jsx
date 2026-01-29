import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/layouts/Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import BudgetOverview from "../../components/Budget/BudgetOverview";
import SimpleBudgetList from "../../components/Budget/SimpleBudgetList";
import AddBudgetForm from "../../components/Budget/AddBudgetForm";
import ChartJsBarChart from "../../components/Charts/ChartJsBarChart";
import ChartJsDoughnutChart from "../../components/Charts/ChartJsDoughnutChart";
import LoadingSpinner from "../../components/LoadingSpinner";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetReport, setBudgetReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [reportStartDate, setReportStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [reportEndDate, setReportEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    startDate: "",
    endDate: "",
    isRecurring: false,
    recurrenceType: "",
  });

  const [activeChartTab, setActiveChartTab] = useState('budgetVsActual');

  const fetchBudgetsAndReport = useCallback(async () => {
    setLoading(true);
    try {
      const budgetsResponse = await axiosInstance.get(
        API_PATHS.BUDGET.GET_ALL_BUDGETS,
      );
      setBudgets(budgetsResponse.data.data.budgets || []);

      const reportResponse = await axiosInstance.get(
        `${API_PATHS.BUDGET.GET_REPORT}?startDate=${reportStartDate}&endDate=${reportEndDate}`,
      );
      const report = reportResponse.data.data.report || [];
      setBudgetReport(report);

      // OPTIMIZATION: Removed fetching of all expenses. 
      // Budget vs Actual data is now fully handled by the GET_REPORT endpoint.
    } catch (err) {
      setError("Failed to fetch data.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [reportStartDate, reportEndDate]);

  useEffect(() => {
    fetchBudgetsAndReport();
  }, [fetchBudgetsAndReport]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      handleChange(name, checked);
    } else if (name === "amount") {
      // Convert amount to number
      handleChange(name, value ? parseFloat(value) : "");
    } else {
      handleChange(name, value);
    }
  };

  const openAddModal = () => {
    setEditingBudget(null);
    setFormData({
      category: "",
      amount: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split("T")[0],
      isRecurring: false,
      recurrenceType: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      startDate: budget.startDate
        ? new Date(budget.startDate).toISOString().split("T")[0]
        : "",
      endDate: budget.endDate
        ? new Date(budget.endDate).toISOString().split("T")[0]
        : "",
      isRecurring: budget.isRecurring,
      recurrenceType: budget.recurrenceType || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        category: formData.category,
        amount: formData.amount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isRecurring: formData.isRecurring,
        recurrenceType: formData.isRecurring ? formData.recurrenceType : null,
      };

      if (new Date(dataToSend.startDate) > new Date(dataToSend.endDate)) {
        alert("End Date must be greater than or equal to Start Date");
        return;
      }

      if (editingBudget) {
        await axiosInstance.put(
          API_PATHS.BUDGET.UPDATE_BUDGET(editingBudget._id),
          dataToSend,
        );
      } else {
        await axiosInstance.post(API_PATHS.BUDGET.ADD_BUDGET, dataToSend);
      }
      fetchBudgetsAndReport();
      closeModal();
      fetchBudgetsAndReport();
      closeModal();
    } catch (err) {
      console.error("Error saving budget:", err);
      const errorMessage = err.response?.data?.message || 
                          (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
                          "Failed to save budget.";
      alert(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(id));
        fetchBudgetsAndReport();
      } catch (err) {
        setError("Failed to delete budget.");
        console.error("Error deleting budget:", err);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Loading budget data..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="card">
          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
            <button
              onClick={fetchBudgetsAndReport}
              className="mt-4 btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }




  return (
    <DashboardLayout activeMenu="Budget">
      <div className="w-full max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Budget Management
        </h1>

        <div className="space-y-6">
          <BudgetOverview
            onAddBudget={openAddModal}
            reportStartDate={reportStartDate}
            setReportStartDate={setReportStartDate}
            reportEndDate={reportEndDate}
            setReportEndDate={setReportEndDate}
            budgetReport={budgetReport}
            budgets={budgets} // Kept for "Total Budgeted" fallback if report empty, though unlikely
          />

          {budgetReport.length > 0 ? (
            <>
              {/* Mobile Tabs */}
              <div className="flex lg:hidden bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6 overflow-x-auto">
                <button 
                  className={`flex-1 min-w-[100px] py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${activeChartTab === 'budgetVsActual' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setActiveChartTab('budgetVsActual')}
                >
                  Vs. Actual
                </button>
                <button 
                  className={`flex-1 min-w-[100px] py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${activeChartTab === 'budgeted' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setActiveChartTab('budgeted')}
                >
                  Budgeted
                </button>
                <button 
                  className={`flex-1 min-w-[100px] py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${activeChartTab === 'spent' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setActiveChartTab('spent')}
                >
                  Spending
                </button>
              </div>

              <div className={`card mb-6 ${activeChartTab === 'budgetVsActual' ? 'block' : 'hidden'} lg:block`}>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Budget vs. Actual Spending
                </h2>
                <div className="h-[220px] lg:h-[350px]">
                  <ChartJsBarChart
                    data={budgetReport.map((item) => ({
                      category: item.category,
                      amount: item.budgetAmount,
                      actual: item.actualSpent,
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`card ${activeChartTab === 'budgeted' ? 'block' : 'hidden'} lg:block`}>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Budgeted Amount by Category
                  </h2>
                  <div className="h-auto flex flex-col">
                    <div className="h-[250px] relative flex items-center justify-center shrink-0">
                        <ChartJsDoughnutChart
                          data={budgetReport.map((item) => ({
                            category: item.category,
                            amount: item.budgetAmount,
                          }))}
                          colors={[
                            "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#f97316", "#06b6d4",
                          ]}
                          showLegend={false}
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[150px] custom-scrollbar pr-2">
                         {budgetReport.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#f97316", "#06b6d4"][index % 8] }}></span>
                              <span className="text-xs text-gray-600 dark:text-gray-300 truncate" title={item.category}>
                                {item.category}: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.budgetAmount)}
                              </span>
                            </div>
                         ))}
                    </div>
                  </div>
                </div>

                <div className={`card ${activeChartTab === 'spent' ? 'block' : 'hidden'} lg:block`}>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Actual Spending by Category
                  </h2>
                  <div className="h-auto flex flex-col">
                    <div className="h-[250px] relative flex items-center justify-center shrink-0">
                        <ChartJsDoughnutChart
                          data={budgetReport.map((item) => ({
                            category: item.category,
                            amount: item.actualSpent,
                          }))}
                          colors={[
                            "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6",
                          ]}
                          showLegend={false}
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[150px] custom-scrollbar pr-2">
                         {budgetReport.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6"][index % 8] }}></span>
                              <span className="text-xs text-gray-600 dark:text-gray-300 truncate" title={item.category}>
                                {item.category}: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.actualSpent)}
                              </span>
                            </div>
                         ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : budgets.length > 0 ? (
            <>
              <div className="card mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Budget Distribution
                </h2>
                <div className="h-auto flex flex-col">
                    <div className="h-[250px] relative flex items-center justify-center shrink-0">
                      <ChartJsDoughnutChart
                        data={budgets.map((item) => ({
                          category: item.category,
                          amount: item.amount,
                        }))}
                        colors={[
                          "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#f97316", "#06b6d4",
                        ]}
                        showLegend={false}
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[150px] custom-scrollbar pr-2">
                         {budgets.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#f97316", "#06b6d4"][index % 8] }}></span>
                              <span className="text-xs text-gray-600 dark:text-gray-300 truncate" title={item.category}>
                                {item.category}: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.amount)}
                              </span>
                            </div>
                         ))}
                    </div>
                  </div>
              </div>
            </>
          ) : null}

          {budgets.length === 0 ? (
            <div className="card">
              <p className="text-gray-700 dark:text-gray-300">
                No budgets set yet. Add your first budget!
              </p>
            </div>
          ) : (
            <SimpleBudgetList
              budgets={budgets}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingBudget ? "Edit Budget" : "Add New Budget"}
        >
          <AddBudgetForm
            formData={formData}
            handleChange={handleChange}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            editingBudget={editingBudget}
            closeModal={closeModal}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
