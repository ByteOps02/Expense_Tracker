// Import necessary packages and components
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import uploadImage from "../../utils/uploadImage";
import AuthBranding from "../../components/layouts/AuthBranding";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";

// SignUp component
const SignUp = () => {
  // State variables for form fields and error handling
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * @desc    Handles the user sign-up process
   * @param   {object} e - The form submission event
   */
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !email || !password) {
      setError("All fields are required.");
      return;
    }
    setError(null);

    try {
      let profileImageUrl = "";
      // If a profile picture is selected, upload it first
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      // Make API call to register the user
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      // On success, store the token and navigate to the dashboard
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Sign up failed. Please try again.",
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
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create an Account
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Join us and start tracking your expenses.
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSignUp}>
            {/* Profile picture upload */}
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            {/* Full name, email, and password input fields */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute top-3.5 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute top-3.5 left-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
               <div className="relative">
                <FiLock className="absolute top-3.5 left-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  autoComplete="new-password"
                />
              </div>
            </div>
            
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>}
            {/* Sign up button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full p-3.5 font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-lg shadow-purple-200 dark:shadow-none"
            >
              Sign Up
            </motion.button>
          </form>
          {/* Link to login page */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;