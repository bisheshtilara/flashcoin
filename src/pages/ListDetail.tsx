import { getCoinByID } from "@/actions/charts";
import { IList, updateList } from "@/actions/lists";
import { IMarket } from "@/actions/topMovers";
import ChartsCoinLists from "@/components/ChartsCoinLists";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { doc, setDoc } from "@firebase/firestore";
import { async } from "@firebase/util";
import React from "react";
import { useLocation } from "react-router-dom";

const ListDetail = () => {
  const location = useLocation();
  const { name, coins, id } = location.state as IList;
  const [coinList, setCoinList] = React.useState<IMarket[]>([]);

  React.useEffect(() => {
    const updateCoins = async () => {
      let newCoinList: IMarket[] = coins;
      coins.forEach(async (coin, index) => {
        const newCoin = await getCoinByID(coin.id);
        if (newCoin && newCoin.userView) {
          newCoinList[index] = newCoin;
        }
      });
      setCoinList(newCoinList);
    };
    updateCoins();
  }, [coins]);


  React.useEffect(() => {
    const updateCoins = async () => {
      const { userId } = useAuth();

      let newCoinList: IMarket[] = coins;
      coins.forEach(async (coin, index) => {
        const newCoin = await getCoinByID(coin.id);
        if (newCoin && newCoin.userView) {
          newCoinList[index] = newCoin;
        }
      });
      await setDoc(doc(db, `users/${userId}/lists`, id), {
        coins: newCoinList,
        name,
      });
      updateCoins();
    };
  }, [id]);

  return (
    <>
      <ChartsCoinLists coinList={coinList} name={name} loading={false} />
    </>
  );
};

export default ListDetail;
