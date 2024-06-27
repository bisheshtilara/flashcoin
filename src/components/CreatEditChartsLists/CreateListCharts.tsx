import { VIEW } from "@/actions/charts";
import { IMarket } from "@/actions/topMovers";
import { useCoinList } from "@/contexts/coinListContext";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CoinListSidebar from "../commons/CoinListSidebar/CoinListSidebar";
import TextInput from "../commons/TextInput";

interface ICreateListChartsProps {
  displayedCoins?: IMarket[];
}

const CreateListCharts: React.FC<ICreateListChartsProps> = ({
  displayedCoins = [],
}) => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [coinsToList, setCoinsToList] = React.useState<IMarket[]>([]);
  const [displayedCoinsList, setDisplayedCoinsList] = React.useState<IMarket[]>(
    []
  );
  const [listName, setListName] = React.useState<string>("");

  React.useEffect(() => {
    setDisplayedCoinsList(displayedCoins);
    }, [displayedCoins]);

  const handleSearch = (value: string) => {
    if (!value)
      return setDisplayedCoinsList(
        displayedCoins.filter((coin) => !coinsToList.includes(coin))
      );
    else
      setDisplayedCoinsList(
        displayedCoinsList.filter((coin) =>
          coin.name.toLowerCase().includes(value.toLowerCase())
        )
      );
  };
  const handleUpdateCoinList = (coin: IMarket) => {
    setCoinsToList([coin, ...coinsToList]);
    setDisplayedCoinsList(
      displayedCoinsList.filter((item) => item.id !== coin.id)
    );
  };

  const handleRemoveFromCoinToList = (coin: IMarket) => {
    setCoinsToList(coinsToList.filter((item) => item.id !== coin.id));
    setDisplayedCoinsList([coin, ...displayedCoinsList]);
  };

  const handleCreateList = async () => {
    if (!listName) {
      toast.error("Please enter a name");
      return;
    }
    if (coinsToList.length === 0) {
      toast.error("Please add at least one coin");
      return;
    }
    try {
      await addDoc(collection(db, `users/${userData.id}/lists`), {
        name: listName,
        coins: coinsToList,
      });
      navigate(-1);
      toast.success(`List has been created successfully`);
    } catch (error) {
      toast.error("Error creating list, please try again later");
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-10 h-full overflow-hidden">
      <div className="col-span-7 flex flex-col gap-10 overflow-hidden p-5">
        <div className="text-2xl font-semibold p-2 w-full">
          <p>Create List</p>
        </div>
        
          <div className="px-20">
            <TextInput
              label={"List name"}
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>
        <div className="px-10 flex items-center justify-center">
          <TextInput
            label="Search"
            icon={<MagnifyingGlassIcon className="h-6 text-red-600" />}
            containerStyle="shadow-md"
            onChange={(e) => handleSearch(e.target.value)}
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
        
          <div className="flex justify-center space-x-4 mb-5">
            <button
              onClick={handleCreateList}
              className="border rounded-lg text-white p-3 bg-green-600 hover:-translate-y-2 duration-300"
            >
              Create
            </button>
            <button
              onClick={() => navigate("/dashboard/lists", { replace: true })}
              className="border rounded-lg text-white p-3 bg-slate-400 hover:-translate-y-2 duration-300"
            >
              Cancel
            </button>
          </div>
      </div>
      <CoinListSidebar coinList={coinsToList} admin handleRemoveFromCoinToList={handleRemoveFromCoinToList}/>
    </div>
  );
};

export default CreateListCharts;
