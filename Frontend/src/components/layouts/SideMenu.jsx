import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path === "/logout") {
      handleLogout();
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-gradient-to-b from-white via-violet-50 to-purple-50 border-r border-gray-200/50 p-5 sticky top-[61px] z-20 shadow-lg hover-lift">
      {/* Always show profile section at the top */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7 animate-fadeIn">
        {!user?.profileImageUrl ? (
          <CharAvatar
            fullName={user?.fullName || 'User'}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        ) : (
          <img
            src={user?.profileImageUrl}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounceIn"
          />
        )}
        <h5 className="text-gray-950 font-medium leading-6 hover:text-violet-600 transition-colors duration-200">
          {user?.fullName || "User"}
        </h5>
      </div>
      <div className="border-b border-gray-200/60 mb-5" />
      {/* Menu items */}
      <div className="space-y-2">
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-3 text-[15px] py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-slideIn font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 ${
              activeMenu === item.label 
                ? "text-white bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg scale-105 ring-2 ring-violet-300" 
                : "text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-100 border border-transparent hover:border-violet-200 hover-lift"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleClick(item.path)}
          >
            {item.icon && (
              <item.icon 
                className={`text-lg transition-all duration-300 ${
                  activeMenu === item.label 
                    ? "text-white" 
                    : "text-violet-500 group-hover:text-violet-700"
                }`} 
              />
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu; 