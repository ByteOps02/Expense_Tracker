import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  // Define color variants mapping
  const colorVariants = {
    "bg-purple-500": "bg-purple-100 text-purple-600",
    "bg-orange-500": "bg-orange-100 text-orange-600",
    "bg-red-500": "bg-red-100 text-red-600",
    "bg-green-500": "bg-green-100 text-green-600",
    "bg-blue-500": "bg-blue-100 text-blue-600",
  };

  // Get the corresponding classes or fallback to gray
  const colorClasses = colorVariants[color] || "bg-gray-100 text-gray-600";

  return (
    <div className="card flex items-center gap-5 p-6 w-full">
      <div
        className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl flex-shrink-0 ${colorClasses}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</h4>
      </div>
    </div>
  );
};

export default InfoCard;