import { getAllDataFromCoinLists, VIEW } from "@/actions/charts";
import { IMarket } from "@/actions/topMovers";
import { db } from "@/firebase";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CoinListSidebar from "../commons/CoinListSidebar/CoinListSidebar";
import TextInput from "../commons/TextInput";

const EditChartsLists: React.FC = () => {
  const [coinsToList, setCoinsToList] = React.useState<IMarket[]>([]);
  const [displayedCoinsList, setDisplayedCoinsList] = React.useState<IMarket[]>(
    []
  );
  const [coinList, setCoinList] = React.useState<IMarket[]>([]);
  const [view, setView] = React.useState<VIEW>(VIEW.USER_VIEW);
  const [loading, setLoading] = React.useState<boolean>(true);

  const getCoinList = async () => {
    const data = await getAllDataFromCoinLists();
    setCoinList(data);
    setLoading(false)
  };

  const getCoinToList = () => {
    setDisplayedCoinsList(coinList.filter((coin) => !coin[view]));
    if (view === VIEW.USER_VIEW)
      setCoinsToList(coinList.filter((coin) => coin.userView));
    else if (view === VIEW.ANONYMOUS_VIEW)
      setCoinsToList(coinList.filter((coin) => coin.anonymousView));
    setLoading(false)
  }

  React.useEffect(() => {
    getCoinList();
  }, []);

  React.useEffect(() => {
    setLoading(true);
    getCoinToList();
  }, [view, coinList]);

  const handleSearch = (value: string) => {
    if (!value)
      return setDisplayedCoinsList(
        coinList.filter((coin) => !coinsToList.includes(coin))
      );
    else
      setDisplayedCoinsList(
        coinList.filter((coin) =>
          coin.name.toLowerCase().includes(value.toLowerCase())
        )
      );
  };
  const handleUpdateCoinList = async (coin: IMarket) => {
    await updateDoc(doc(db, "coinLists", coin.id), {
      [view]: true,
    });
    setCoinList(coinList.map(c => {
      if (c.id === coin.id) {
        return {
          ...c,
          [view]: true,
        };
      }
      return c;
    }))
    toast.info(`${coin.name} added to ${view === VIEW.USER_VIEW ? "user view" : "anonymous view"} list`)
  };

  const handleSetDisplayedCoinsList = async (coin : IMarket) => {
    setCoinList(coinList.map(c => {
      if (c.id === coin.id) {
        return {
          ...c,
          [view]: false,
        };
      }
      return c;
    }));
    toast.info(`${coin.name} removed from ${view === VIEW.USER_VIEW ? "user view" : "anonymous view"} list`)
  }

  return (
    <div className="grid grid-cols-10 h-full overflow-hidden">
      <div className="col-span-7 flex flex-col gap-10 overflow-hidden p-5">
        <div className="text-2xl font-semibold p-2 w-full">
          <p>Edit coin list</p>
        </div>
        <div className="px-10 flex items-center justify-center">
          <TextInput
            label="Search"
            icon={<MagnifyingGlassIcon className="h-6 text-red-600" />}
            containerStyle="shadow-md"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div role="buttonGroup" className="grid grid-cols-2 gap-16 mx-10">
          <ActionButton
            action={() => setView(VIEW.USER_VIEW)}
            selected={view === VIEW.USER_VIEW}
            label="User view"
          />
          <ActionButton
            action={() => setView(VIEW.ANONYMOUS_VIEW)}
            selected={view === VIEW.ANONYMOUS_VIEW}
            label="Anonymous view"
          />
        </div>
        <div className="h-full bg-gray-100 rounded-xl m-10 p-10 space-y-2 overflow-y-scroll scrollbar-hide tracking-tighter">
          <div className="overflow-y-scroll grid grid-cols-2 gap-3">
            {displayedCoinsList.map((coin, index) => {
              const price = Number(coin.priceUsd).toFixed(2);
              const changePercent = Number(coin.changePercent24Hr).toFixed(2);
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-2 hover:scale-95 duration-300 text-lg grid grid-cols-10"
                >
                  <div className="flex items-center gap-2 col-span-7">
                    <img
                      src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                      alt="Mover Logo"
                      className="h-12"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium whitespace-nowrap">
                        {coin.name}
                      </p>
                      <p className="font-light text-base tracking-wide text-gray-500">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center gap-2 justify-between">
                    <div className="flex flex-col">
                      <p className="font-medium">${price}</p>
                      <div className="flex items-center gap-1">
                        <p
                          className={`${
                            Number(changePercent) < 0
                              ? "text-red-500"
                              : "text-green-500"
                          } font-light`}
                        >
                          {changePercent}%
                        </p>
                        {Number(changePercent) < 0 ? (
                          <ArrowDownIcon className="h-4 text-red-500" />
                        ) : (
                          <ArrowUpIcon className="h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div
                      className="col-span-1"
                      role="button"
                      onClick={() => handleUpdateCoinList(coin)}
                    >
                      <PlusIcon className="h-6 bg-green-500 text-white rounded-full p-1 hover:scale-110 duration-300 cursor-pointer" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <CoinListSidebar coinList={coinsToList} admin view={view} handleSetDisplayedCoinsList={handleSetDisplayedCoinsList} loading={loading}/>
    </div>
  );
};

const ActionButton: React.FC<{
  label: string;
  selected: boolean;
  action: () => void;
}> = ({ label, selected, action }) => {
  return (
    <div
      role="button"
      onClick={action}
      className={`flex items-center gap-3 rounded-xl ${
        selected ? "bg-red-500 text-white" : "border-2"
      } p-2 justify-center transition-all ease-in hover:-translate-y-1`}
    >
      <p>{label}</p>
    </div>
  );
};

export default EditChartsLists;
