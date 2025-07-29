import React, { useContext } from 'react'
import { UserContext } from "../../context/UserContext"
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext)
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar activeMenu={activeMenu} />
            {user && (
                <div className="flex">
                    <div className="hidden lg:block">
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    <div className="grow ml-10 pt-20 pb-8 bg-gray-50 min-h-[calc(100vh-61px)] lg:ml-72">
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout