import { IList } from "@/actions/lists";
import { IMarket } from "@/actions/topMovers";
import ActionButton from "@/components/commons/ActionButton";
import ActionsListModal from "@/components/commons/ActionsListModal";
import { useUserList } from "@/contexts/userListContext";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import flashCoinLogo from "@assets/logos/secondary_logo.svg";
import TextInput from "@components/commons/TextInput";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Steps } from "intro.js-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClimbingBoxLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";

enum ACTIONS {
  REMOVE_LIST = "REMOVE_LIST",
  REMOVE_COIN = "REMOVE_COIN",
}
const steps: { element: string; intro: string; position?: string }[] = [
  {
    element: "#addList",
    intro: "Click here to make a list of crypto coins.",
    position: "left",
  },
];

const Lists: React.FC = ({}) => {
  const [stepsEnabled, setStepsEnabled] = useState<boolean>(
    localStorage.getItem("firstLists") ? true : false
  );
  React.useEffect(() => {
    if (localStorage.getItem("firstLists")) setStepsEnabled(true);
  }, [localStorage.getItem("firstLists")]);

  const navigate = useNavigate();
  const [duplicateList, setDuplicateList] = useState<IList[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [selectedList, setSelectedList] = useState<string>("");
  const [selectedCoin, setSelectedCoin] = useState<IMarket>({} as IMarket);
  const [action, setAction] = useState<ACTIONS | null>(null);
  const { userData } = useAuth();
  const { lists, loading } = useUserList();

  React.useEffect(() => {
    setDuplicateList(lists);
  }, [lists]);

  const handleSearch = (value: string) => {
    setDuplicateList(
      lists.filter((list) =>
        list.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleRemoveList = async () => {
    try {
      await deleteDoc(doc(db, `users/${userData.id}/lists/${selectedList}`));
      setIsOpen(false);
      setSelectedList("");
      setTitle("");
      setAction(null);
    } catch (error) {
      toast.error("Something went wrong, please try again later");
      console.log(error);
    }
  };

  const handleRemoveCoinFromList = async () => {
    try {
      await updateDoc(doc(db, `users/${userData.id}/lists/${selectedList}`), {
        coins: arrayRemove(selectedCoin),
      });
      setIsOpen(false);
      setSelectedList("");
      setTitle("");
      setAction(null);
    } catch (error) {
      toast.error("Something went wrong, please try again later");
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full justify-center items-center flex">
        <ClimbingBoxLoader color="red" size={25} />
      </div>
    );
  }
  return (
    <>
      <div className="px-10 pt-10 flex items-center justify-center relative">
        <PlusCircleIcon
          onClick={() => navigate("/dashboard/lists/create")}
          className="h-14 text-green-600 absolute top-24 z-20 right-10 hover:-translate-y-1 duration-300 ease-in-out flex items-center justify-center cursor-pointer"
          id="addList"
        />
        <TextInput
          label="Search"
          icon={<MagnifyingGlassIcon className="h-6 text-red-600" />}
          containerStyle="w-[80%] shadow-md"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-8 px-10 pt-10 pb-60 my-8 overflow-y-scroll h-screen scrollbar-hide">
        {duplicateList.map((list, index) => {
          const { name, coins, id } = list;
          return (
            <div
              className="flex flex-col rounded-3xl p-6 border border-b-0 shadow-md"
              key={index}
            >
              <div className="flex justify-between pb-4">
                <div className="flex gap-2 items-center text-xl font-medium ml-1">
                  <img src={flashCoinLogo} alt="FlashCoin" className="h-9" />
                  <p className="tracking-tighter">{name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={`${id}`} state={{ ...list, id }}>
                    <ActionButton details />
                  </Link>
                  <ActionButton
                    remove
                    action={() => {
                      setTitle("Remove list");
                      setAction(ACTIONS.REMOVE_LIST);
                      setSelectedList(id);
                      setIsOpen(true);
                    }}
                  />
                </div>
              </div>
              <p className="text-gray-400 font-semibold text-base pb-2 ml-2">{`${coins.length} items`}</p>
              <div className="flex-grow h-96 border bg-gray-100 rounded-3xl p-5 overflow-y-scroll scrollbar-hide">
                <div className="grid gap-3">
                  {coins.map((item: IMarket, index: number) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center bg-white rounded-full px-5 py-1 justify-between"
                      >
                        <div className="flex gap-3 items-center text-base">
                          <img
                            src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                            alt={item.name}
                            className="h-10"
                          />
                          <div className="flex flex-col tracking-wide">
                            <p className="font-regular max-w-xs truncate">
                              {item.name}
                            </p>
                            <p className="text-gray-400 font-light truncate max-w-xs">
                              {item.symbol}
                            </p>
                          </div>
                        </div>
                        <ActionButton
                          remove
                          action={() => {
                            setTitle(`Remove ${item.name} from list ${name}`);
                            setSelectedList(id);
                            setSelectedCoin(item);
                            setAction(ACTIONS.REMOVE_COIN);
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ActionsListModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title}
        handleAction={
          action === ACTIONS.REMOVE_LIST
            ? handleRemoveList
            : action === ACTIONS.REMOVE_COIN
            ? handleRemoveCoinFromList
            : null
        }
      />
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={0}
        onExit={() => {
          setStepsEnabled(false);
          localStorage.removeItem("firstLists");
        }}
      />
    </>
  );
};

export default Lists;
