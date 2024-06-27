import { IMarket } from "@/actions/topMovers";
import { db } from "@/firebase";
import { CoinHistory } from "@/types/crypto";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import axios from "axios";
import moment from "moment";
import React from "react";
import { ClimbingBoxLoader } from "react-spinners";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CoinListSidebar from "../commons/CoinListSidebar/CoinListSidebar";

interface IChartsCoinListsProps {
  coinList: IMarket[];
  loading: boolean;
  name?: string;
}

export const ChartsCoinLists: React.FC<IChartsCoinListsProps> = ({
  coinList,
  loading,
  name,
}) => {
  const [selectedCoin, setSelectedCoin] = React.useState<IMarket>(
    {} as IMarket
  );
  const [coinHistory, setCoinHistory] = React.useState<CoinHistory>([]);
  const [marketingStats, setMarketingStats] = React.useState<
    {
      label: string;
      value: string | number;
    }[]
  >([]);
  const [minMaxUsd, setMinMaxUsd] = React.useState<[number, number]>([0, 0]);
  const [selectedTime, setSelectedTime] = React.useState<string>("ALL");
  // const [chartLoading, setChartLoading] = React.useState<boolean>(true);
  const [duplicateCoinList, setDuplicateCoinList] = React.useState<IMarket[]>(
    []
  );

  React.useEffect(() => {
    if (coinList.length === 0) return;
    setDuplicateCoinList(coinList);
  }, [coinList]);

  const coinCapApi = axios.create({
    baseURL: "https://api.coincap.io/v2/assets",
  });

  React.useEffect(() => {
    if (coinList.length === 0) return;
    const selectedCoinStoraged = localStorage.getItem("selectedCoin");
    if (!selectedCoinStoraged || !coinList.find((item) => item.id === JSON.parse(selectedCoinStoraged).id)) {
      setSelectedCoin(coinList[0]);
      setMarketingStats([
        {
          label: "Market Cap",
          value: coinList[0].marketCapUsd,
        },
        {
          label: "Volume(24H)",
          value: coinList[0].volumeUsd24Hr,
        },
        {
          label: "Circulating Supply",
          value: coinList[0].supply,
        },
        {
          label: "Popularity",
          value: coinList[0].rank,
        },
      ]);
    } else {
      const coinToFind = coinList.find(
        (item) => item.id === JSON.parse(selectedCoinStoraged).id
      );
      setSelectedCoin(
        coinToFind ? coinToFind : JSON.parse(selectedCoinStoraged)
      );
    }
  }, [coinList]);

  React.useEffect(() => {
    const getCoinHistory = async () => {
      if (!selectedCoin) {
        localStorage.setItem("selectedCoin", coinList?.[0].id);
        setSelectedCoin(coinList?.[0]);
      } else
        setMarketingStats([
          {
            label: "Market Cap",
            value: selectedCoin?.marketCapUsd,
          },
          {
            label: "Volume(24H)",
            value: selectedCoin?.volumeUsd24Hr,
          },
          {
            label: "Circulating Supply",
            value: selectedCoin?.supply,
          },
          {
            label: "Popularity",
            value: selectedCoin?.rank,
          },
        ]);

      const docRef = doc(
        db,
        `coinLists/${selectedCoin?.id}/history`,
        selectedTime
      );
      const data = await getDoc(docRef);
      if (data.exists() && data.data().history.length > 0) {
        setCoinHistory(data.data().history);
        setMinMaxUsd([
          Math.min(
            ...(data.data().history as CoinHistory).map((item) =>
              Number(item.priceUsd)
            )
          ),
          Math.max(
            ...(data.data().history as CoinHistory).map((item) =>
              Number(item.priceUsd)
            )
          ),
        ]);
      } else {
        try {
          const startFrom =
            selectedTime === "ALL"
              ? moment().subtract(10, "years")
              : selectedTime === "1Y"
              ? moment().subtract(1, "year")
              : selectedTime === "1M"
              ? moment().subtract(1, "month")
              : selectedTime === "1W"
              ? moment().subtract(1, "week")
              : moment().subtract(1, "day");
          const response = await coinCapApi.get(
            `/${selectedCoin?.id}/history`,
            {params: {
              interval: ["1W", "1M", "1Y", "ALL"].includes(selectedTime) ? "d1" : "h1",
              start: startFrom.unix() * 1000,
              end: moment().unix() * 1000,
            },}
          );
          const history = response.data.data;
          setCoinHistory(history);
          setMinMaxUsd([
            Math.min(...history.map((item: any) => Number(item.priceUsd))),
            Math.max(...history.map((item: any) => Number(item.priceUsd))),
          ]);
          await setDoc(docRef, {
            history,
          });
        } catch (error) {
          setCoinHistory([]);
          setMinMaxUsd([0, 0]);
        }
      }
      // setChartLoading(false);
    };
    getCoinHistory();
  }, [selectedCoin, selectedTime]);

  //  format big values to K , M , B
  const formatValue = (value: any) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    } else {
      return value;
    }
  };

  return (
    <>
      <div className="grid grid-cols-10 h-full w-full">
        {loading ? (
          <div className="col-span-7 flex items-center justify-center">
            <ClimbingBoxLoader color="red" size={25} />
          </div>
        ) : (
          <div className="col-span-7 p-8">
            <div className="inline-flex gap-2">
              <p className="font-medium text-4xl">
                ${Number(selectedCoin?.priceUsd).toFixed(2)}
              </p>
              <p
                className={`${
                  Number(selectedCoin?.changePercent24Hr) < 0
                    ? "text-red-500"
                    : "text-green-500"
                } text-sm`}
              >
                {Number(selectedCoin?.changePercent24Hr).toFixed(2)}%
              </p>
            </div>
            <div className="flex gap-2 float-right">
              <button
                className={`${
                  selectedTime === "ALL" ? "text-blue-500" : ""
                } rounded-md px-2 py-1`}
                onClick={() => setSelectedTime("ALL")}
              >
                ALL
              </button>
              <button
                className={`${
                  selectedTime === "1Y" ? "text-blue-500" : ""
                } rounded-md px-2 py-1`}
                onClick={() => setSelectedTime("1Y")}
              >
                1Y
              </button>
              <button
                className={`${
                  selectedTime === "1M" ? "text-blue-500" : ""
                } rounded-md px-2 py-1`}
                onClick={() => setSelectedTime("1M")}
              >
                1M
              </button>
              <button
                className={`${
                  selectedTime === "1W" ? "text-blue-500" : ""
                } rounded-md px-2 py-1`}
                onClick={() => setSelectedTime("1W")}
              >
                1W
              </button>
              <button
                className={`${
                  selectedTime === "1D" ? "text-blue-500" : ""
                } rounded-md px-2 py-1`}
                onClick={() => setSelectedTime("1D")}
              >
                1D
              </button>
            </div>
            <ResponsiveContainer width="100%" height="60%">
              <LineChart data={coinHistory}>
                <XAxis
                  dataKey="time"
                  tickCount={6}
                  minTickGap={30}
                  padding={{ right: 70 }}
                  tickFormatter={(value: number) =>
                    moment(value).format(
                      selectedTime === "ALL"
                        ? "MMM YYYY"
                        : selectedTime === "1Y"
                        ? "MMMM"
                        : selectedTime === "1M"
                        ? "MMM DD"
                        : selectedTime === "1W"
                        ? "ddd"
                        : "MMM DD HH:mm"
                    )
                  }
                />
                <YAxis
                  dataKey="priceUsd"
                  tickFormatter={(value: string) =>
                    `$${Number(value).toFixed(0)}`
                  }
                  tickCount={10}
                  domain={minMaxUsd}
                  allowDecimals={false}
                  minTickGap={30}
                />
                <Tooltip
                  formatter={(value: string) => [`$${value}`, "Price"]}
                  labelFormatter={(value: number) =>
                    moment(value).format("MMMM Do YYYY")
                  }
                  itemStyle={{ color: "#000" }}
                />
                <Line
                  type="monotone"
                  dataKey="priceUsd"
                  stroke="#3b82f6"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="tracking-tighter">
              <p className="font-medium text-2xl pt-10 pb-7">{`Marketing Stats ${selectedCoin.name}`}</p>
              <div className="flex gap-6 justify-around">
                {marketingStats?.map(({ label, value }, index) => (
                  <div key={index}>
                    <p className="font-light text-gray-400 text-xl tracking-wider">
                      {label}
                    </p>
                    <p className="font-medium text-lg mt-1">
                      {index === marketingStats.length - 1 ? "#" : "$"}
                      {formatValue(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <CoinListSidebar
          coinList={coinList}
          loading={loading}
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          name={name}
        />
      </div>
    </>
  );
};

export default ChartsCoinLists;
