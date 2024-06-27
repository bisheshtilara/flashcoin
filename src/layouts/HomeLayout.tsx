import Sidebar, { ITabs } from "@/components/commons/Sidebar/Sidebar";
import { CoinListProvider } from "@/contexts/coinListContext";
import { NewsProvider } from "@/contexts/newsContext";
import { UserListProvider } from "@/contexts/userListContext";
import { AuthProvider } from "@/hooks/useAuth";
import {
  ChartBarIcon,
  HeartIcon,
  ListBulletIcon,
  NewspaperIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useOutlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const HomeLayout: React.FC = () => {
  const outlet = useOutlet();
  const tabs: ITabs[] = [
    {
      name: "News",
      Icon: <NewspaperIcon className="h-7" />,
      path: "home",
      pathname: "/dashboard/home",
    },
    {
      name: "Charts",
      Icon: <ChartBarIcon className="h-7" />,
      path: "charts",
      pathname: "/dashboard/charts",
    },
    {
      name: "Favorites",
      Icon: <HeartIcon className="h-7" />,
      path: "favorites",
      pathname: "/dashboard/favorites",
    },
    {
      name: "Lists",
      Icon: <ListBulletIcon className="h-7" />,
      path: "lists",
      pathname: "/dashboard/lists",
    },
    {
      name: "Profile",
      Icon: <UserIcon className="h-7" />,
      path: "profile",
      pathname: "/dashboard/profile",
    },
  ];
  return (
    <AuthProvider>
      <NewsProvider>
        <CoinListProvider>
          <UserListProvider>
            <div className="h-screen flex overflow-hidden font-poppins">
              <Sidebar tabs={tabs} />
              <div className="flex-grow overflow-hidden scrollbar-hide">
                {outlet}
                <ToastContainer />
              </div>
            </div>
          </UserListProvider>
        </CoinListProvider>
      </NewsProvider>
    </AuthProvider>
  );
};

export default HomeLayout;
