import React from "react";
import { LuArrowRight, LuWalletMinimal } from "react-icons/lu";
import moment from "moment";

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <div className="card animate-bounceIn h-[400px] transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg font-semibold text-gray-900">Income</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>
      <div className="mt-6">
        <ul>
          {transactions?.slice(0, 4)?.map((item, idx) => (
            <li
              key={item._id}
              className="flex items-center justify-between bg-gray-50 rounded-lg mb-3 p-3 animate-fadeIn"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center gap-3">
                {item.icon ? (
                  <img src={item.icon} alt={item.source} className="w-6 h-6" />
                ) : (
                  <LuWalletMinimal className="text-2xl text-gray-400" />
                )}
                <div>
                  <div className="font-medium text-gray-800">{item.source}</div>
                  <div className="text-xs text-gray-400">
                    {moment(item.date).format("DD MMM, YYYY")}
                  </div>
                </div>
              </div>
              <div className="font-semibold text-lg text-green-600">
                + ₹{item.amount}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentIncome;
