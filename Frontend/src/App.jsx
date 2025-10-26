// Import necessary packages and components
import React, { useEffect, useContext, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import UserProvider, { UserContext } from "./context/UserContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load all page components for better performance
// This splits the code into smaller chunks and loads them on demand
const Login = lazy(() => import("./pages/Auth/Login"));
const SignUp = lazy(() => import("./pages/Auth/SignUp"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Income = lazy(() => import("./pages/Dashboard/Income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));
const ManagePasskeys = lazy(() => import("./pages/Dashboard/ManagePasskeys"));

// Main App component
const App = () => {
  return (
    // Wrap the entire application in an ErrorBoundary to catch and handle errors
    <ErrorBoundary>
      {/* UserProvider provides user context to all components */}
      <UserProvider>
        <ClearAuthOnLoad />
        <div>
          <Router>
            <ErrorBoundary>
              {/* Suspense is used with lazy loading to show a fallback while components are loading */}
              <Suspense
                fallback={
                  <LoadingSpinner fullScreen text="Loading application..." />
                }
              >
                {/* Define the application routes */}
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

/**
 * @desc    Component to clear auth token and user context on app load
 *          This is to ensure that no stale authentication data persists
 */
const ClearAuthOnLoad = () => {
  const userContext = useContext(UserContext);
  useEffect(() => {
    // Only clear if no valid token exists in localStorage
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

/**
 * @desc    Root component to handle initial navigation
 *          Redirects to the dashboard if authenticated, otherwise to the login page
 */
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};