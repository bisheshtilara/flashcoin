import axios from "axios";
import { getAllDataFromCoinLists } from "./charts";
export interface IMarket {
  changePercent24Hr: string;
  explorer: string;
  id: string;
  marketCapUsd: string;
  maxSupply: string;
  name: string;
  priceUsd: string;
  rank: string;
  supply: string;
  symbol: string;
  volumeUsd24Hr: string;
  vwap24Hr: string;
  userView?: boolean;
  anonymousView?: boolean;
}

export interface ITopMovers {
  name: string;
  symbol: string;
  image: string;
  changePercent24Hr: string;
  priceUsd: string;
}

export const getMarkets = async () => {
  try {
    const result: IMarket[] = await (
      await axios.get(import.meta.env.VITE_API_GET_MARKETS, {headers: {Authorization: `Bearer ${import.meta.env.VITE_API_KEY_GET_MARKETS}`}})
    ).data.data;
    return result.filter((market) => market.hasOwnProperty("id"));
  } catch (error) {
    return []
  }
};

export const getMarketById = async (coin : IMarket) => {
  try {
    const result: IMarket = await (
      await axios.get(`${import.meta.env.VITE_API_GET_MARKETS}/${coin.id}`, {headers: {Authorization: `Bearer ${import.meta.env.VITE_API_KEY_GET_MARKETS}`}, params: {limit: 100}})
    ).data.data;
    if (result.hasOwnProperty("id")) {
      return result;
    }
    return coin;
  } catch (error) {
    return coin;
  }
};

export const getTopMovers = async () => {
  const markets = await getAllDataFromCoinLists();
  const changePercent24Hr: any[] = [];

  markets?.map((market) => {
    changePercent24Hr.push({
      name: market.name,
      symbol: market.symbol,
      image: `https://assets.coincap.io/assets/icons/${market.symbol.toLowerCase()}@2x.png`,
      changePercent24Hr: market.changePercent24Hr,
      priceUsd: market.priceUsd,
    });
  });
  const topMovers: ITopMovers[] = changePercent24Hr
    .sort(
      (a, b) =>
        (b.changePercent24Hr.includes("-")
          ? b.changePercent24Hr.substring(1)
          : b.changePercent24Hr) -
        (a.changePercent24Hr.includes("-")
          ? a.changePercent24Hr.substring(1)
          : a.changePercent24Hr)
    )
    .slice(0, 10);
  return topMovers;
};
