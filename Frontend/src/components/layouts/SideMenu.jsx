import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ activeMenu, onClose }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path === "/logout") {
      handleLogout();
      return;
    }
    navigate(path);
    // Close mobile menu if it's open
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-full bg-gradient-to-br from-white via-violet-50 to-purple-100 border-r border-violet-200/40 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-y-auto lg:fixed lg:top-[61px] lg:left-0 lg:h-[calc(100vh-61px)] lg:z-50">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-violet-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-5 w-24 h-24 bg-purple-400 rounded-full blur-2xl"></div>
      </div>

      {/* Profile section with enhanced styling */}
      <div className="relative flex flex-col items-center justify-center gap-4 mt-4 mb-8 animate-fadeIn">
        <div className="relative group">
          {!user?.profileImageUrl ? (
            <div className="relative">
              <CharAvatar
                fullName={user?.fullName || "User"}
                width="w-24"
                height="h-24"
                style="text-2xl font-semibold"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={user?.profileImageUrl}
                alt="Profile Image"
                className="w-24 h-24 bg-slate-400 rounded-full object-cover shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 animate-bounceIn ring-4 ring-white/50 group-hover:ring-violet-200/50"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          )}
          {/* Status indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
        </div>

        <div className="text-center">
          <h5 className="text-gray-900 font-semibold text-lg leading-tight hover:text-violet-700 transition-colors duration-300">
            {user?.fullName || "User"}
          </h5>
          <p className="text-violet-600 text-sm font-medium mt-1 opacity-80">
            Premium Member
          </p>
        </div>
      </div>

      {/* Enhanced separator */}
      <div className="relative mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
        </div>
      </div>

      {/* Menu items with enhanced styling */}
      <div className="space-y-3 relative">
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`group w-full flex items-center gap-4 text-[15px] py-3.5 px-5 rounded-xl transition-all duration-500 transform hover:scale-105 animate-slideIn font-medium focus:outline-none focus:ring-2 focus:ring-violet-300/50 relative overflow-hidden ${
              activeMenu === item.label
                ? "text-white bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 shadow-xl scale-105 ring-2 ring-violet-300/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                : "text-gray-700 hover:text-violet-800 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 border border-transparent hover:border-violet-200/50 hover:shadow-lg hover-lift"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleClick(item.path)}
          >
            {/* Background glow effect for active items */}
            {activeMenu === item.label && (
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-purple-400/20 blur-xl"></div>
            )}

            <div className="relative z-10 flex items-center gap-4 w-full">
              {item.icon && (
                <div
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    activeMenu === item.label
                      ? "text-white bg-white/20 backdrop-blur-sm"
                      : "text-violet-500 group-hover:text-violet-700 group-hover:bg-violet-100/50"
                  }`}
                >
                  <item.icon className="text-xl" />
                </div>
              )}
              <span className="font-semibold">{item.label}</span>

              {/* Arrow indicator for active items */}
              {activeMenu === item.label && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="w-16 h-1 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full opacity-60"></div>
      </div>
    </div>
  );
};

export default SideMenu;
