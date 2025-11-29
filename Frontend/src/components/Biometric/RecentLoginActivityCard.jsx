import React from "react";

const RecentLoginActivityCard = ({ activities }) => {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Login Activity</h2>
      {activities && activities.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {activities.map((activity, index) => (
            <li key={index} className="py-3 flex justify-between items-center text-gray-700">
              <div>
                <p className="font-medium">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                activity.status === "Successful" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {activity.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No recent login activities found.</p>
      )}
      <button className="btn-secondary mt-4 px-4 py-2 rounded-md shadow-sm">View All Activity</button>
    </div>
  );
};

export default RecentLoginActivityCard;