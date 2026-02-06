// Import necessary packages and components
import React, { lazy, Suspense, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import UserProvider from "./context/UserContext.jsx";
import { UserContext } from "./context/UserContextDefinition";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load page components
const Login = lazy(() => import("./pages/Auth/Login"));
const SignUp = lazy(() => import("./pages/Auth/SignUp"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Income = lazy(() => import("./pages/Dashboard/Income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));
const Settings = lazy(() => import("./pages/Dashboard/Settings"));
const Budget = lazy(() => import("./pages/Dashboard/Budget"));
const RecentTransactionsPage = lazy(() => import("./pages/Dashboard/RecentTransactionsPage"));

/**
 * @desc Protected Route wrapper
 *       Shows a loading spinner while checking auth state.
 *       Redirects to login if user is not authenticated.
 */
const ProtectedRoute = ({ Component }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <LoadingSpinner fullScreen text="Authenticating..." />;
  }

  return user ? <Component /> : <Navigate to="/login" replace />;
};

// Main App component
const App = () => {
  return (

      <ErrorBoundary>
        <UserProvider>
          <ThemeProvider>
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
                      <Route
                        path="/settings"
                        element={<ProtectedRoute Component={Settings} />}
                      />
                      <Route
                        path="/budget"
                        element={<ProtectedRoute Component={Budget} />}
                      />
                      <Route
                        path="/recent-transactions"
                        element={<ProtectedRoute Component={RecentTransactionsPage} />}
                      />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </Router>
              <Analytics />
            </div>
          </ThemeProvider>
        </UserProvider>
      </ErrorBoundary>

  );
};

export default App;
