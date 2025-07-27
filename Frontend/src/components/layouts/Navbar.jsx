import React, { useState, useEffect } from 'react'
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    // Prevent background scroll when SideMenu is open
    useEffect(() => {
        if (openSideMenu) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => document.body.classList.remove('overflow-hidden');
    }, [openSideMenu]);

    return (
        <div className='flex items-center justify-between bg-gradient-to-r from-white via-violet-50 to-purple-50 border-b border-violet-200/50 py-2 px-5 sticky top-0 z-30 shadow-lg shadow-violet-500/10'>
            <div className='flex items-center gap-5'>
                <button className='block lg:hidden text-violet-600 hover:text-white hover:bg-violet-600 p-1.5 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-300 shadow-md hover:shadow-lg hover:scale-105'
                    onClick={() => {
                        setOpenSideMenu(!openSideMenu);
                    }}>
                    {openSideMenu ? (
                        <HiOutlineX className='text-2xl' />
                    ) : (
                        <HiOutlineMenu className='text-2xl' />
                    )}
                </button>
                <h2 className='text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm animate-pulse'>Expense Tracker</h2>
            </div>
            {/* User profile section */}
            <div className='hidden lg:flex items-center gap-4'>
                {/* User profile indicator */}
                <div className='flex items-center gap-2 p-1.5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-md border border-violet-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group'>
                    <div className='w-7 h-7 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs'>
                        A
                    </div>
                    <div className='hidden xl:block'>
                        <p className='text-sm font-semibold text-gray-800'>Aman</p>
                        <p className='text-xs text-violet-600'>Premium</p>
                    </div>
                </div>
            </div>
            {openSideMenu && (
                <div className='fixed top-0 left-0 w-64 h-full bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out'>
                    <SideMenu activeMenu={activeMenu} onClose={() => setOpenSideMenu(false)} />
                </div>
            )}
        </div>
    )
}

export default Navbar 