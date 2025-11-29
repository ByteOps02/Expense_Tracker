import React, { useState, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  // Prevent background scroll when SideMenu is open
  useEffect(() => {
    if (openSideMenu) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [openSideMenu]);

  return (
    <div className="glass flex items-center justify-between border-b border-gray-100 py-3 px-6 fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="flex items-center gap-5">
        <button
          className="block lg:hidden text-gray-600 hover:text-purple-600 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-100"
          onClick={() => {
            setOpenSideMenu(!openSideMenu);
          }}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span className="text-purple-600">Expense</span> Tracker
        </h2>
      </div>
      {openSideMenu && (
        <div className="fixed top-[61px] left-0 w-64 h-[calc(100vh-61px)] bg-white/95 backdrop-blur-xl shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
          <SideMenu
            activeMenu={activeMenu}
            onClose={() => setOpenSideMenu(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
