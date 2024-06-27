import { ACTION, VIEW } from "@/actions/charts";
import { addToFavorites, removeFromFavorites } from "@/actions/favorites";
import { IList } from "@/actions/lists";
import { IMarket } from "@/actions/topMovers";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  HeartIcon,
  PlusCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  MinusCircleIcon,
} from "@heroicons/react/24/solid";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import CoinListSideBarModal from "../CoinListSideBarModal";
import TextInput from "../TextInput";

export enum ACTION_TYPE {
  ADD_TO_FAVORITE = "add_to_favorite",
  REMOVE_FROM_FAVORITE = "remove_from_favorite",
  ADD_TO_LIST = "add_to_list",
}

interface ICoinListSidebar {
  coinList: IMarket[];
  loading?: boolean;
  selectedCoin?: IMarket;
  name?: string;
  setSelectedCoin?: React.Dispatch<React.SetStateAction<IMarket>>;
  admin?: boolean;
  view?: VIEW | "";
  handleSetDisplayedCoinsList?: (coin: IMarket) => void;
  handleRemoveFromCoinToList?: (coin: IMarket) => void;
}
const CoinListSidebar: React.FC<ICoinListSidebar> = ({
  coinList,
  loading = false,
  selectedCoin = {} as IMarket,
  name,
  setSelectedCoin = () => {},
  admin = false,
  view = "",
  handleSetDisplayedCoinsList,
  handleRemoveFromCoinToList
}) => {
  const [userCoinLists, setUserCoinLists] = React.useState<IList[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [addToList, setAddToList] = React.useState<boolean>(false);
  const [selectedList, setSelectedList] = React.useState<string>("");
  const [coinSelected, setCoinSelected] = React.useState<string>("");
  const [coin, setCoin] = React.useState<IMarket>({} as IMarket);
  const [actionType, setActionType] = React.useState<ACTION_TYPE | undefined>();
  const [duplicateCoinList, setDuplicateCoinList] =
    React.useState<IMarket[]>(coinList);
  const { userData } = useAuth();

  React.useEffect(() => {
    setDuplicateCoinList(coinList);
  }, [coinList]);

  const handleSearch = (value: string) => {
    setDuplicateCoinList(
      coinList?.filter((coin) =>
        coin.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    const getUserLists = async () => {
      try {
        const lists = await getDocs(
          collection(db, `users/${userData.id}/lists`)
        );
        setUserCoinLists(
          lists.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as IList[]
        );
      } catch (error) {
        console.log(error);
      }
    };
    getUserLists();
  }, [userData]);

  const handleFavoriteClick = (coin: IMarket, action: ACTION) => {
    setCoinSelected(coin.id);
    setTitle(
      action === ACTION.ADD ? `Add to favorites` : `Remove from favorites`
    );
    setAddToList(false);
    setActionType(
      action === ACTION.ADD
        ? ACTION_TYPE.ADD_TO_FAVORITE
        : ACTION_TYPE.REMOVE_FROM_FAVORITE
    );
    setIsOpen(true);
  };

  const handleAddToListClick = (coin: IMarket) => {
    setCoin(coin);
    setTitle(`Add to list`);
    setAddToList(true);
    setIsOpen(true);
  };

  const handleAddToFavorite = async () => {
    try {
      await addToFavorites(userData.id, coinSelected);
      toast.success("Added to favorites successfully");
    } catch {
      toast.error("Something went wrong, please try again later");
    }
    setIsOpen(false);
  };

  const handleRemoveFromFavorite = async () => {
    try {
      await removeFromFavorites(userData.id, coinSelected);
      toast.success("Removed from favorites successfully");
    } catch {
      toast.error("Something went wrong, please try again later");
    }
    setIsOpen(false);
  };

  const handleAddToList = async () => {
    try {
      await updateDoc(doc(db, `users/${userData.id}/lists`, selectedList), {
        coins: arrayUnion(coin),
      });
      setIsOpen(false);
      setCoin({} as IMarket);
      setSelectedList("");
    } catch {
      toast.error("Something went wrong, please try again later");
    }
  };

  const handleRemoveFromView = async (coin: IMarket) => {
    try {
      setDuplicateCoinList(duplicateCoinList.filter((c) => c.id !== coin.id));
      if (handleSetDisplayedCoinsList) {
        await updateDoc(doc(db, "coinLists", coin.id), {
          [view]: false,
        });
        handleSetDisplayedCoinsList(coin)
      };
      if (handleRemoveFromCoinToList) {
        handleRemoveFromCoinToList(coin)
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-xl col-span-3 overflow-hidden">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <HashLoader color="#dc2626" size={100} />
        </div>
      ) : (
        <div className="tracking-tighter text-lg h-full py-8">
          <p className="text-2xl font-medium mb-8 pb-4 shadow-md px-8">
            {name ? name : "Coin list"}
          </p>
          <div className="w-full bg-white pr-10 pl-7 py-4">
            <TextInput
              label="Search"
              onChange={(e) => handleSearch(e.target.value)}
              containerStyle=""
            />
          </div>
          <div className="flex flex-col gap-6 overflow-y-scroll h-full scrollbar-hide pt-3 pb-16">
            {duplicateCoinList?.map((coin) => (
              <CoinItem
                coin={coin}
                key={coin.id}
                showActionButtons={
                  admin ? false : userData?.anonymous ? false : true
                }
                selectedCoin={selectedCoin}
                setSelectedCoin={setSelectedCoin}
                favorites={userData?.favorites ? userData?.favorites : []}
                handleAddToListClick={handleAddToListClick}
                handleFavoriteClick={handleFavoriteClick}
                handleRemoveFromView={() => handleRemoveFromView(coin)}
                admin={admin}
                view={view}
              />
            ))}
          </div>
        </div>
      )}
      <CoinListSideBarModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title}
        content={
          addToList ? (
            <ListsSelect
              coinSelected={coin}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
              userCoinLists={userCoinLists}
            />
          ) : (
            <p>
              Do you want to
              {actionType === ACTION_TYPE.ADD_TO_FAVORITE
                ? ` add ${selectedCoin.name} to your favorites`
                : ` remove ${selectedCoin.name} from your favorites`}
            </p>
          )
        }
        action={"Confirm"}
        handleAction={
          actionType === ACTION_TYPE.ADD_TO_FAVORITE
            ? handleAddToFavorite
            : actionType === ACTION_TYPE.REMOVE_FROM_FAVORITE
            ? handleRemoveFromFavorite
            : handleAddToList
        }
      />
    </div>
  );
};
export default CoinListSidebar;

const CoinItem: React.FC<{
  coin: IMarket;
  showActionButtons?: boolean;
  selectedCoin?: IMarket;
  setSelectedCoin?: React.Dispatch<React.SetStateAction<IMarket>>;
  favorites: string[];
  handleFavoriteClick?: (coin: IMarket, action: ACTION) => void;
  handleAddToListClick?: (coin: IMarket) => void;
  admin?: boolean;
  view?: VIEW | "";
  handleRemoveFromView?: (coin: IMarket) => Promise<void>;
}> = ({
  coin,
  showActionButtons = false,
  selectedCoin,
  favorites,
  setSelectedCoin,
  handleFavoriteClick,
  handleAddToListClick,
  handleRemoveFromView,
  admin,
  view = "",
}) => {
  const price = Number(coin.priceUsd).toFixed(2);
  const changePercent = Number(coin.changePercent24Hr).toFixed(2);
  const [showButton, setShowButton] = React.useState<boolean>(false);
  const { userData } = useAuth();
  return (
    <>
      <div
        className={`transition-all ease-in-out hover:scale-95 duration-300 px-8 cursor-pointer relative mx-1 ${
          selectedCoin === coin
            ? "bg-gray-200/70 shadow-lg rounded-md py-1"
            : null
        }`}
        onMouseEnter={() => {
          setShowButton(true);
        }}
        onMouseLeave={() => {
          setShowButton(false);
        }}
        key={coin.id}
        onClick={() => {
          localStorage.setItem("selectedCoin", JSON.stringify(coin));
          setSelectedCoin?.(coin);
        }}
      >
        {userData && showButton && showActionButtons && handleFavoriteClick ? (
          favorites.includes(coin.id) ? (
            <div
              className="absolute -top-2 left-2 transition-all ease-in-out hover:-translate-y-1 duration-300"
              role="button"
              onClick={() => handleFavoriteClick(coin, ACTION.REMOVE)}
            >
              <HeartIconSolid className="h-6 bg-white rounded-full shadow-md text-red-500" />
            </div>
          ) : (
            <div
              className="absolute -top-2 left-2 transition-all ease-in-out hover:-translate-y-1 duration-300"
              role="button"
              onClick={() => handleFavoriteClick(coin, ACTION.ADD)}
            >
              <HeartIcon className="h-6 bg-white rounded-full shadow-md text-red-500" />
            </div>
          )
        ) : null}

        {userData && showButton && showActionButtons && handleAddToListClick ? (
          <div
            className="absolute -top-2 right-2 transition-all ease-in-out hover:-translate-y-1 duration-300"
            role="button"
            onClick={() => handleAddToListClick(coin)}
          >
            <PlusCircleIcon className="h-6 bg-white rounded-full shadow-md text-green-500" />
          </div>
        ) : null}
        {admin && showButton && !showActionButtons ? (
          <div
            className="absolute -top-2 left-2 transition-all ease-in-out hover:-translate-y-1 duration-300"
            role="button"
            onClick={() => {
              if (handleRemoveFromView) handleRemoveFromView(coin);
            }}
          >
            <MinusCircleIcon className="h-6 bg-white rounded-full shadow-md text-red-500" />
          </div>
        ) : null}
        <div className="grid grid-cols-12 items-center">
          <div className="flex items-center gap-2 col-span-9">
            <img
              src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
              className="h-12"
            />
            <div className="flex flex-col">
              <p className="font-medium">{coin.name}</p>
              <p className="font-light tracking-wide text-gray-500 text-base">
                {coin.symbol}
              </p>
            </div>
          </div>
          <div className="flex flex-col col-span-3">
            <p className="font-medium">${price}</p>
            <div className="flex items-center">
              <>
                {Number(changePercent) > 0 ? (
                  <ArrowUpIcon className="h-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-4 text-red-500" />
                )}
                <p
                  className={`${
                    Number(changePercent) > 0
                      ? "text-green-500"
                      : "text-red-500"
                  } font-light tracking-normal`}
                >
                  {changePercent}%
                </p>
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface IListsSelectProps {
  userCoinLists: IList[];
  coinSelected: IMarket;
  setSelectedList: (listID: string) => void;
  selectedList: string;
}
const ListsSelect: React.FC<IListsSelectProps> = ({
  userCoinLists,
  coinSelected,
  selectedList,
  setSelectedList,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4">
      {userCoinLists?.map((list) => {
        return (
          <button
            key={list.id}
            onClick={() => setSelectedList(list.id)}
            className={`${
              list.coins.find((coin) => coin.id === coinSelected.id)
                ? "hidden"
                : ""
            } p-2 rounded-lg hover:-translate-y-2 duration-300 cursor-pointer hover:bg-red-800 ${
              selectedList === list.id
                ? "bg-red-600 text-white"
                : "bg-white border border-black"
            }`}
          >
            {list.name}
          </button>
        );
      })}
      <button
        onClick={() => navigate("/dashboard/lists/create")}
        className="flex items-center justify-center text-white p-2 rounded-lg hover:-translate-y-2 duration-300 cursor-pointer hover:bg-green-800 bg-green-600"
      >
        <PlusIcon className="h-6" />
        <span className="ml-2">New List</span>
      </button>
    </div>
  );
};
