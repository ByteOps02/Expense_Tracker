import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/UserContext.jsx";
import { UserContext } from "./context/UserContext";

const App = () => {
  return (
    <UserProvider>
      <ClearAuthOnLoad />
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

// Component to clear auth token and user context on app load
const ClearAuthOnLoad = () => {
  const userContext = useContext(UserContext);
  useEffect(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    if (userContext && userContext.clearUser) {
      userContext.clearUser();
    }
  }, []);
  return null;
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};
