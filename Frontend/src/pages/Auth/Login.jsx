// Import necessary packages and components
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { FaFingerprint } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { validateEmail } from "../../utils/helper";
import AuthBranding from "../../components/layouts/AuthBranding";
import BiometricLock from "../../components/BiometricLock";

// Login component
const Login = () => {
  // State variables for email, password, error, and biometric lock visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showBiometricLock, setShowBiometricLock] = useState(false);

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

  /**
   * @desc    Handles successful biometric login
   * @param   {object} user - The user object
   * @param   {string} token - The JWT token
   */
  const handleBiometricSuccess = (user, token) => {
    localStorage.setItem("token", token);
    updateUser(user);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Branding component for the authentication pages */}
      <AuthBranding />
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-800 text-white p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-400">
              Login to continue your journey.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email and password input fields */}
            <div className="relative">
              <FiMail className="absolute top-3.5 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                autoComplete="username"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute top-3.5 left-3 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {/* Login button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 12px rgb(168, 85, 247)",
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full p-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              LOGIN
            </motion.button>
          </form>
          {/* Biometric login button */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowBiometricLock(true)}
              className="flex items-center justify-center w-full p-3 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              <FaFingerprint className="mr-2" />
              Login with Biometrics
            </button>
          </div>
          {/* Link to sign up page */}
          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
      {/* Biometric lock modal */}
      {showBiometricLock && (
        <BiometricLock
          email={email}
          onUnlock={handleBiometricSuccess}
          onClose={() => setShowBiometricLock(false)}
        />
      )}
    </div>
  );
};

export default Login;