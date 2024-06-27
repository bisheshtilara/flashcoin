import { updateHistory, updateHistorys } from "@/actions/charts";
import { IMarket } from "@/actions/topMovers";
import { useCoinList } from "@/contexts/coinListContext";
import { db } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, setDoc } from "@firebase/firestore";
import React from "react";
import Switch from "react-switch";
import { toast } from "react-toastify";
const Settings = () => {
  const [realTime, setRealTime] = React.useState<boolean>(false);
  const [generateCoin, setGenerateCoin] = React.useState<boolean>(false);
  const [time, setTime] = React.useState<string>("1D");
  const [loadingUpdateHistory, setLoadingUpdateHistory] =
    React.useState<boolean>(false);
  const [selectedCoin, setSelectedCoin] =
    React.useState<IMarket | null | "ALL">();
  const times = ["ALL", "1D", "1W", "1M", "1Y"];
  const { coinList } = useCoinList();

  React.useEffect(() => {
    const subscribe = onSnapshot(collection(db, "settings"), (snapshot) => {
      const status : any = snapshot.docs.map(
        (doc) => doc.data()
      );
      setGenerateCoin(status[0].generateCoin ? status[0].generateCoin : false);
    });
    return subscribe;
  }, []);

  React.useEffect(() => {
    const subscribe = onSnapshot(collection(db, "settings"), (snapshot) => {
      const status : any = snapshot.docs.map(
        (doc) => doc.data()
      );
      setRealTime(status[0].realTime ? status[0].realTime : false);
    });
    return subscribe;
  }, [generateCoin]);

  const handleUpdateGenerateCoin = async () => {
    try {
      await setDoc(doc(db, "settings", "status"), {
        generateCoin: !generateCoin,
        realTime
      });
      toast.success("Generate coin status updated");
      setGenerateCoin(!generateCoin);
    } catch {
      toast.error("Error updating generate coin status, please try again");
    }
  };

  const handleUpdateRealTime = async () => {
    try {
      await setDoc(doc(db, "settings", "status"), {
        realTime: !realTime,
        generateCoin
      });
      toast.success("Real time status updated");
      setRealTime(!realTime);
    } catch {
      toast.error("Error updating real time status, please try again");
    }
  };

  const handleUpdateHistory = async () => {
    if (!selectedCoin) {
      toast.error("Please select a coin");
      setLoadingUpdateHistory(false);
      return;
    }
    if (selectedCoin === "ALL") {
      await updateHistorys(time, setLoadingUpdateHistory);
    } else {
      await updateHistory(selectedCoin, time, setLoadingUpdateHistory);
    }
  };

  return (
    <div className="flex gap-8 w-full justify-center items-center h-full bg-slate-200">
      <div className="flex flex-col items-center border shadow-lg rounded-lg p-5 bg-white gap-4">
        <span>Generate coins</span>
        <Switch checked={generateCoin} onChange={handleUpdateGenerateCoin} />
      </div>
      <div className="flex flex-col items-center border shadow-lg rounded-lg p-5 bg-white gap-4">
        <span>Real time prices</span>
        <Switch checked={realTime} onChange={handleUpdateRealTime} />
      </div>
      <div className="flex flex-col items-center border shadow-lg rounded-lg p-5 bg-white gap-4">
        <span>Update history</span>
        <div>
          <label>Coin selected:</label>
          <select
            className="border rounded-md p-1"
            value={
              selectedCoin
              ? selectedCoin === "ALL"
                ? "__ALL__"
                : selectedCoin.name
              : "__CLEAR__"
            }
            onChange={(e) => {
              if (e.target.value === "__CLEAR__") {
                setSelectedCoin(null);
              } else if (e.target.value === "__ALL__") {
                setSelectedCoin("ALL");
              } else {
                setSelectedCoin(
                  coinList.find((coin) => coin.name === e.target.value)
                );
              }
            }}
          >
            <option value="__CLEAR__">Select a coin</option>
            <option value="__ALL__">All coins</option>
            {coinList.map((coin) => (
              <option key={coin.name} value={coin.name}>
                {coin.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Time selected:</label>
          <select
            className="border rounded-md p-1"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="h-5">
          {loadingUpdateHistory ? "Loading..." : ""}
        </div>
        <button
          onClick={() => {
            setLoadingUpdateHistory(true);
            handleUpdateHistory();
          }}
          className="bg-blue-500 text-white rounded-md p-1"
        >
          Execute
        </button>
      </div>
    </div>
  );
};
export default Settings;
