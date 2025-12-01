export const BASE_URL = import.meta.env.VITE_BASE_URL;
// utils/apiPath.js
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUser",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },
  INCOME: {
    ADD_INCOME: "/api/v1/income",
    GET_ALL_INCOME: "/api/v1/income",
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
    DOWNLOAD_INCOME: `/api/v1/income/download-excel`,
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense",
    GET_ALL_EXPENSE: "/api/v1/expense",
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
    DOWNLOAD_EXPENSE: `/api/v1/expense/download-excel`,
  },
  BUDGET: {
    ADD_BUDGET: "/api/v1/budgets",
    GET_ALL_BUDGETS: "/api/v1/budgets",
    GET_BUDGET: (budgetId) => `/api/v1/budgets/${budgetId}`,
    UPDATE_BUDGET: (budgetId) => `/api/v1/budgets/${budgetId}`,
    DELETE_BUDGET: (budgetId) => `/api/v1/budgets/${budgetId}`,
    GET_REPORT: "/api/v1/budgets/report/actual-vs-budget",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
};
