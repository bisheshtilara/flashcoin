import { IMarket } from "@/actions/topMovers";
import ChartsCoinLists from "@/components/ChartsCoinLists";
import { useCoinList } from "@/contexts/coinListContext";
import React from "react";
import { ClimbingBoxLoader } from "react-spinners";

const Favorites: React.FC = ({}) => {
  const { favoriteList, favoriteLoading: loading } = useCoinList();

  if (loading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <ClimbingBoxLoader color="red" size={25} />
      </div>
    );

  if (!favoriteList.length)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-2xl">No favorites added yet</p>
      </div>
    );
  return (
    <>
      <ChartsCoinLists
        coinList={favoriteList}
        loading={loading}
        name={"Favorites"}
      />
    </>
  );
};

export default Favorites;
