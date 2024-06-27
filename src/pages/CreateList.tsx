import { IMarket } from "@/actions/topMovers";
import CreateListCharts from "@/components/CreatEditChartsLists/CreateListCharts";
import React from "react";
import { getAllDataFromCoinLists } from "@/actions/charts";

const EditCharts = () => {
  const [coinList, setCoinList] = React.useState<IMarket[]>([]);
  React.useEffect(() => {
    const getCoinList = async () => {
      const coinList = await getAllDataFromCoinLists();
      setCoinList(coinList);
    };
    getCoinList();
  }, []);  

  return <CreateListCharts displayedCoins={coinList} />;
};

export default EditCharts;