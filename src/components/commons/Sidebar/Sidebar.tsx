import { useAuth } from "@/hooks/useAuth";
import flashCoinLogo from "@assets/logos/primary_logo.svg";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { Steps } from "intro.js-react";
import React from "react";
import { useNavigate } from "react-router-dom";
export interface ITabs {
  name: string;
  Icon: JSX.Element;
  path: string;
  pathname?: string;
}
const steps: { element: string; intro: string; position?: string }[] = [
  {
    element: "#News",
    intro: "This is where you can see the latest news about crypto",
    position: "right",
  },
  {
    element: "#Charts",
    intro: "This is where you can see visualized data about crypto",
    position: "right",
  },
  {
    element: "#Favorites",
    intro:
      "This is where your favorite crypto coins are stored with data visualization",
    position: "right",
  },
  {
    element: "#Lists",
    intro: "This is where you can save or make your own lists of crypto coins",
    position: "right",
  },
  {
    element: "#Profile",
    intro:
      "This is where you can see your profile information and edit that information",
    position: "right",
  },
];

const Sidebar: React.FC<{ tabs: ITabs[] }> = ({ tabs }) => {
  const navigate = useNavigate();
  const { signout, user } = useAuth();
  const [stepsEnabled, setStepsEnabled] = React.useState<boolean>(
    localStorage.getItem("firstLogin") ? true : false
  );
  React.useEffect(() => {
    if (localStorage.getItem("firstLogin")) setStepsEnabled(true);
  }, [localStorage.getItem("firstLogin")]);

  return (
    <>
      <div className="w-96 bg-white shadow-2xl rounded-3xl h-screen flex flex-col justify-between">
        <div className="grid grid-cols-1 gap-5">
          <img src={flashCoinLogo} alt="FlashCoin" className="h-56 mx-auto" />
          <div className="grid grid-cols-1 gap-5">
            {tabs.map((tab, index) => (
              <div
                className="flex items-center gap-3 group"
                key={index}
                id={tab.name}
              >
                <div
                  className={`w-2 h-full border-r-[5px] border-red-600 rounded-full ${
                    location.pathname === tab.pathname
                      ? "scale-100"
                      : "group-hover:scale-75 scale-0"
                  } transition-all ease-in `}
                />
                <div
                  role="button"
                  onClick={() => navigate(tab.path)}
                  className={`flex-grow ${
                    location.pathname === tab.pathname
                      ? "bg-red-600 text-white translate-x-6 font-semibold border-2 border-white ring-2 ring-red-600"
                      : "group-hover:translate-x-4 border"
                  } p-3 shadow-md rounded-lg flex items-center gap-4 mr-16 pl-6 transition-all ease-in font-light`}
                >
                  <div className="justify-self-end">{tab.Icon}</div>
                  <p className="justify-self-start">{tab.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {user ? (
          <div
            role="button"
            className="bg-red-600 text-white font-semibold flex items-center gap-3 p-2 border-2 border-white ring-2 ring-red-600 shadow-md hover:translate-x-4 mb-12 pl-16 ml-3 mr-16 rounded-lg transition-all ease-in"
            onClick={signout}
          >
            <ArrowLeftOnRectangleIcon className="h-7" />
            <p>Signout</p>
          </div>
        ) : null}
      </div>
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={0}
        onExit={() => {
          setStepsEnabled(false);
          localStorage.removeItem("firstLogin");
        }}
      />
    </>
  );
};

export default Sidebar;
