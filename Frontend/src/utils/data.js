import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuSettings,
  LuPiggyBank,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },
  { // New Budget entry
    id: "04",
    label: "Budget",
    icon: LuPiggyBank,
    path: "/budget",
  },
  {
    id: "05", // Updated ID
    label: "Settings",
    icon: LuSettings,
    path: "/settings",
  },
  {
    id: "06", // Updated ID
    label: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];
