// Import necessary packages and components
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { LuSun, LuMoon } from "react-icons/lu";
import { UserContext } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { validateEmail } from "../../utils/helper";
import AuthBranding from "../../components/layouts/AuthBranding";

// Login component
const Login = () => {
  // State variables for email, password, error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { theme, toggleTheme } = useTheme();

  // Get user context and navigation functions
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  /**
   * @desc    Handles the standard email/password login process
   * @param   {object} e - The form submission event
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!validateEmail(email) || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError(null);

    try {
      // Make API call to log in
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      // On success, store the token, update the user context, and navigate to the dashboard
      localStorage.setItem("token", response.data.token);
      updateUser(response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Branding component for the authentication pages */}
      <AuthBranding />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <LuSun className="text-xl text-yellow-500" />
              ) : (
                <LuMoon className="text-xl text-purple-600" />
              )}
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Please enter your details to sign in.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email and password input fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute top-3.5 left-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute top-3.5 left-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  autoComplete="current-password"
                />
              </div>
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>}
            {/* Login button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full p-3.5 font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-lg shadow-purple-200 dark:shadow-none"
            >
              Sign In
            </motion.button>
          </form>
          {/* Link to sign up page */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-purple-600 dark:text-purple-400"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;