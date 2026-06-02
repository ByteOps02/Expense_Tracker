import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuSettings,
  LuPiggyBank,
  LuArrowRightLeft,
  LuTrendingUp,
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
  {
    id: "04",
    label: "Transactions",
    icon: LuArrowRightLeft,
    path: "/recent-transactions",
  },
  {
    id: "05",
    label: "Monthly Analytics",
    icon: LuTrendingUp,
    path: "/monthly-analytics",
  },
  {
    id: "06",
    label: "Settings",
    icon: LuSettings,
    path: "/settings",
  },
  {
    id: "07",
    label: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];
