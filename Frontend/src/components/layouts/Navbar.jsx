import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    return (
        <div className='flex items-center justify-between bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 shadow-sm'>
            <div className='flex items-center gap-5'>
                <button className='block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors'
                    onClick={() => {
                        setOpenSideMenu(!openSideMenu);
                    }}>
                    {openSideMenu ? (<HiOutlineX className='text-2xl' />) : (<HiOutlineMenu className='text-2xl' />)}
                </button>
                <h2 className='text-2xl font-bold text-violet-600 tracking-tight drop-shadow-sm'>Expense Tracker</h2>
            </div>
            {/* Placeholder for user avatar/profile menu */}
            <div className='hidden lg:flex items-center gap-4'>
                {/* You can add a user avatar or profile dropdown here in the future */}
            </div>
            {openSideMenu && (
                <>
                    <div className='fixed top-[61px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40 lg:hidden'
                        onClick={() => setOpenSideMenu(false)}
                    />
                    <div className='fixed top-[61px] left-0 w-64 h-full bg-white shadow-lg z-50 lg:hidden'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                </>
            )}
        </div>
    )
}

export default Navbar 