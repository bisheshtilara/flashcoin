import Sidebar, { ITabs } from "@/components/commons/Sidebar/Sidebar";
import { CoinListProvider } from "@/contexts/coinListContext";
import { NewsProvider } from "@/contexts/newsContext";
import { AuthProvider } from "@/hooks/useAuth";
import {
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  NewspaperIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useOutlet } from "react-router-dom";

const AnonymousLayout: React.FC = () => {
  const outlet = useOutlet();
  const tabs: ITabs[] = [
    {
      name: "News",
      Icon: <NewspaperIcon className="h-7" />,
      path: "home",
      pathname: "/anonymous/home",
    },
    {
      name: "Charts",
      Icon: <ChartBarIcon className="h-7" />,
      path: "charts",
      pathname: "/anonymous/charts",
    },
    {
      name: "Signin",
      Icon: <ArrowRightOnRectangleIcon className="h-7" />,
      path: "/auth/signin",
    },
    {
      name: "Signup",
      Icon: <WifiIcon className="h-7" />,
      path: "/auth/signup",
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
            </div>
          </div>
        </CoinListProvider>
      </NewsProvider>
    </AuthProvider>
  );
};

export default AnonymousLayout;
