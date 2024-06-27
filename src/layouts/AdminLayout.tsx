import Sidebar, { ITabs } from "@/components/commons/Sidebar/Sidebar";
import { CoinListProvider } from "@/contexts/coinListContext";
import { NewsProvider } from "@/contexts/newsContext";
import { AuthProvider } from "@/hooks/useAuth";
import {
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  Cog8ToothIcon,
  NewspaperIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useOutlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AdminLayout: React.FC = () => {
  const outlet = useOutlet();
  const tabs: ITabs[] = [
    {
      name: "News",
      Icon: <NewspaperIcon className="h-7" />,
      path: "editNews",
      pathname: "/admin/editNews",
    },
    {
      name: "Charts",
      Icon: <ChartBarIcon className="h-7" />,
      path: "editCharts",
      pathname: "/admin/editCharts",
    },
    {
      name: "Settings",
      Icon: <Cog8ToothIcon className="h-7" />,
      path: "settings",
      pathname: "/admin/settings",
    },
  ];

  return (
    <AuthProvider>
      <NewsProvider>
        <CoinListProvider>
          <div className="h-screen flex overflow-hidden font-poppins">
            <Sidebar tabs={tabs} />
            <div className="flex-grow overflow-hidden scrollbar-hide">
              {outlet}
              <ToastContainer />
            </div>
          </div>
        </CoinListProvider>
      </NewsProvider>
    </AuthProvider>
  );
};

export default AdminLayout;
