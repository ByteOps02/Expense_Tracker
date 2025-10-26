// Import necessary packages and components
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiCamera } from "react-icons/fi";
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
    <div className="min-h-screen flex">
      {/* Branding component for the authentication pages */}
      <AuthBranding />
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-800 text-white p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Create an Account
            </h2>
            <p className="mt-2 text-gray-400">
              Join us and start tracking your expenses.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSignUp}>
            {/* Profile picture upload */}
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            {/* Full name, email, and password input fields */}
            <div className="relative">
              <FiUser className="absolute top-3.5 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <FiMail className="absolute top-3.5 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
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
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {/* Sign up button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 12px rgb(168, 85, 247)",
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full p-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              SIGN UP
            </motion.button>
          </form>
          {/* Link to login page */}
          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;