import React, { useEffect, useContext, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import UserProvider, { UserContext } from "./context/UserContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load all page components for better performance
const Login = lazy(() => import("./pages/Auth/Login"));
const SignUp = lazy(() => import("./pages/Auth/SignUp"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Income = lazy(() => import("./pages/Dashboard/Income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));
const ManagePasskeys = lazy(() => import("./pages/Dashboard/ManagePasskeys"));

const App = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ClearAuthOnLoad />
        <div>
          <Router>
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading application..." />}>
                <Routes>
                  <Route path="/" element={<Root />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/dashboard" element={<Home />} />
                  <Route path="/income" element={<Income />} />
                  <Route path="/expense" element={<Expense />} />
                  <Route path="/security" element={<ManagePasskeys />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </Router>
        </div>
      </UserProvider>
    </ErrorBoundary>
  );
};

// Component to clear auth token and user context on app load
const ClearAuthOnLoad = () => {
  const userContext = useContext(UserContext);
  useEffect(() => {
    // Only clear if no valid token exists
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.removeItem("token");
      if (userContext && userContext.clearUser) {
        userContext.clearUser();
      }
    }
  }, [userContext]);
  return null;
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};
