import { db } from "@/firebase";
import axios from "axios";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import moment from "moment";
import { toast } from "react-toastify";
import { getMarkets, IMarket } from "./topMovers";

export enum VIEW {
  USER_VIEW = "userView",
  ANONYMOUS_VIEW = "anonymousView",
}

export enum ACTION {
  ADD = "ADD",
  REMOVE = "REMOVE",
}

interface IUpdateCoinLists {
  view: VIEW;
  id: string;
  action: ACTION;
}

const coinLists = "coinLists";

export const getAllDataFromCoinLists = async () => {
  const docSnap = await getDocs(collection(db, coinLists));
  if (docSnap) {
    const result: IMarket[] = [];
    docSnap.docs.map((doc) => {
      if (doc.data().id) {
        result.push({ ...doc.data() } as IMarket);
      } else {
        deleteDoc(doc.ref);
      }
    });
    return result;
  } else {
    return [];
  }
};

const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const addMissingHistory = async () => {
  const coinLists = await getAllDataFromCoinLists();

  coinLists.map(async (coin) => {
    const times = ["1W", "1M", "1Y", "ALL", "1D"];
    times.map(async (time) => {
      const coinRef = doc(db, `coinLists/${coin.id}/history`, time);
      const history = await getDoc(coinRef);
      if (!history.exists() || history.data().history.length === 0) {
        const startFrom =
          time === "ALL"
            ? moment().subtract(10, "years")
            : time === "1Y"
            ? moment().subtract(1, "year")
            : time === "1M"
            ? moment().subtract(1, "month")
            : time === "1W"
            ? moment().subtract(1, "week")
            : moment().subtract(1, "day");
        const coinCapApi = axios.create({
          baseURL: import.meta.env.VITE_API_GET_MARKETS,
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY_GET_MARKETS}`,
          },
        });

        try {
          const res = await coinCapApi.get(`/${coin.id}/history`, {
            params: {
              interval: ["1W", "1M", "1Y", "ALL"].includes(time) ? "d1" : "h1",
              start: startFrom.unix() * 1000,
              end: moment().unix() * 1000,
            },
          });
          await setDoc(doc(db, `coinLists/${coin.id}/history`, time), {
            history: res.data.data,
          });
        } catch (e) {
          console.log(`Error: ${e}`);
        }
      }
    });
  });
};

export const updateHistory = async (
  market: IMarket,
  time: string,
  setLoadingUpdateHistory?: any
) => {
  const coinCapApi = axios.create({
    baseURL: import.meta.env.VITE_API_GET_MARKETS,
  });
  const startFrom =
    time === "ALL"
      ? moment().subtract(10, "years")
      : time === "1Y"
      ? moment().subtract(1, "year")
      : time === "1M"
      ? moment().subtract(1, "month")
      : time === "1W"
      ? moment().subtract(1, "week")
      : moment().subtract(1, "day");
  try {
    const res = await coinCapApi.get(`/${market.id}/history`, {
      params: {
        interval: ["1W", "1M", "1Y", "ALL"].includes(time) ? "d1" : "h1",
        start: startFrom.unix() * 1000,
        end: moment().unix() * 1000,
      },
    });
    await setDoc(doc(db, `coinLists/${market.id}/history`, time), {
      history: res.data.data,
    });
    if (setLoadingUpdateHistory) {
      toast.success("Update history success");
    }
  } catch {
    toast.error("Error: Cannot get history data");
  }
  if (setLoadingUpdateHistory) {
    setLoadingUpdateHistory(false);
  }
};

export const updateHistorys = async (time: string, setLoading: any) => {
  const markets = await getMarkets();
  markets.map(async (market, index) => {
    await updateHistory(market, time);
    if (index === markets.length - 1) {
      toast.info("Update historys done");
      setLoading(false);
    }
  });
};

export const generateCoinList = async () => {
  const coinLists = await getAllDataFromCoinLists();
  try {
    //merge old data to new data
    let markets: IMarket[] = await getMarkets();
    markets?.forEach(async (market, index) => {
      const coin = await getCoinByID(market.id);
      if (coin) {
        const computedChangePercent24Hr =
          !coin.vwap24Hr || !coin.priceUsd
            ? 0
            : ((Number(coin.priceUsd) - Number(coin.vwap24Hr)) /
                Number(coin.vwap24Hr)) *
              100;

        const newCoin = {
          ...coin,
          ...market,
          userView: coin.userView ? coin.userView : false,
          anonymousView: coin.anonymousView ? coin.anonymousView : false,
          changePercent24Hr: market.changePercent24Hr
            ? market.changePercent24Hr
            : computedChangePercent24Hr.toString(),
        };
        await setDoc(doc(db, "coinLists", market.id), newCoin);
      }
    });
    return markets;
  } catch {
    return coinLists;
  }
};

export const updateCoinLists = async ({
  view,
  id,
  action,
}: IUpdateCoinLists) => {
  try {
    const cointLists = await getAllDataFromCoinLists();
    const coin = cointLists?.find((coin) => coin.id === id);
    if (coin) {
      await setDoc(doc(db, coinLists, id), {
        ...coin,
        [view]: action === ACTION.ADD ? true : false,
      });
    } else {
      throw new Error("Coin not found");
    }
  } catch (e) {
    console.log(`Error: ${e}`);
  }
};
export const getCoinByID = async (id: string) => {
  try {
    const coinRef = doc(db, coinLists, id);
    const coin = await getDoc(coinRef);
    if (coin.exists()) {
      return coin.data() as IMarket;
    } else {
      throw new Error("Coin does not exist");
    }
  } catch (e) {
    //console.log(`Error: ${e}`);
  }
};

export const getCoinsbyIDs = async (ids: string[]) => {
  try {
    let coins: IMarket[] = [];
    for (const i of ids) {
      const coin = await getCoinByID(i);
      if (coin) {
        coins = [...coins, coin];
      }
    }
    return coins;
  } catch (e) {
    // console.log(`Error: ${e}`);
  }
};

export const getRTCoinsMarket = async () => {
  try {
    const pricesWs = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");
    pricesWs.onmessage = function (msg) {
      const data = JSON.parse(msg.data);
      const coinIDs = Object.keys(data);
      if (!data) return;
      coinIDs.map(async (coinID: any) => {
        const coin = await getCoinByID(coinID);
        if (coin) {
          await setDoc(doc(db, coinLists, coinID), {
            ...coin,
            priceUsd: data[coinID],
          });
        }
        
      });
    };
  } catch {
    // console.log(`Error: ${e}`);
  }
};
