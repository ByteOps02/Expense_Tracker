// Import necessary packages and components
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

// Layout component for the dashboard pages
const DashboardLayout = ({ children, activeMenu }) => {
  // Get the user from the UserContext
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <Navbar activeMenu={activeMenu} />
      {/* Render the side menu and content only if the user is logged in */}
      {user && (
        <div className="flex">
          {/* Side menu for larger screens */}
          <div className="hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>
          {/* Main content area */}
          <div className="grow mx-5 pt-20 pb-8 bg-gray-50 min-h-[calc(100vh-61px)] lg:ml-64">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;