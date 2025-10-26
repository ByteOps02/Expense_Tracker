import React from "react";
import { motion } from "framer-motion";

const AuthBranding = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gray-900 items-center justify-center p-12 text-center">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-bold text-white mb-4">Expense Tracker</h1>
        <p className="text-xl text-gray-300">
          Take control of your finances with our intuitive and powerful expense
          tracking app.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthBranding;
