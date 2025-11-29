// Import necessary packages and components
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import UserProvider from "./context/UserContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load page components
const Login = lazy(() => import("./pages/Auth/Login"));
const SignUp = lazy(() => import("./pages/Auth/SignUp"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Income = lazy(() => import("./pages/Dashboard/Income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));


// Main App component
const App = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <div>
          <Router>
            <ErrorBoundary>
              <Suspense
                fallback={
                  <LoadingSpinner fullScreen text="Loading application..." />
                }
              >
                <Routes>
                  {/* Always redirect root to login */}
                  <Route path="/" element={<Navigate to="/login" replace />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={<ProtectedRoute Component={Home} />}
                  />
                  <Route
                    path="/income"
                    element={<ProtectedRoute Component={Income} />}
                  />
                  <Route
                    path="/expense"
                    element={<ProtectedRoute Component={Expense} />}
                  />

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
 * @desc Protected Route wrapper
 *       Only allows access if token exists
 */
const ProtectedRoute = ({ Component }) => {
  const token = localStorage.getItem("token");

  return token ? <Component /> : <Navigate to="/login" replace />;
};

export default App;
