import {
  generateCoinList,
  getCoinsbyIDs,
  getRTCoinsMarket,
  VIEW,
} from "@/actions/charts";
import { IMarket } from "@/actions/topMovers";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import React from "react";

const CoinListContext = React.createContext<{
  coinList: IMarket[];
  userCoinList: IMarket[];
  anonymousCoinList: IMarket[];
  loading: boolean;
  favoriteList: IMarket[];
  hiddenCoins?: IMarket[];
  favoriteLoading: boolean;
}>({
  coinList: [],
  loading: true,
  favoriteList: [],
  userCoinList: [],
  anonymousCoinList: [],
  hiddenCoins: [],
  favoriteLoading: true,
});

export const CoinListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [coinList, setCoinList] = React.useState<IMarket[]>([]);
  const [userCoinList, setUserCoinList] = React.useState<IMarket[]>([]);
  const [anonymousCoinList, setAnonymousCoinList] = React.useState<IMarket[]>(
    []
  );
  const [hiddenCoins, setHiddenCoins] = React.useState<IMarket[]>([]);
  const [favoriteList, setFavoriteList] = React.useState<IMarket[]>([]);
  const [favoriteLoading, setFavoriteLoading] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { userData } = useAuth();

  const getCoinLists = async () => {
    const favorites = userData?.favorites ? userData.favorites : [];
    const listCoinsFavorites = await getCoinsbyIDs(favorites);
    setFavoriteList(
      listCoinsFavorites
        ? listCoinsFavorites.filter((item) => item.userView)
        : []
    );
    setFavoriteLoading(false);
  };

  React.useEffect(() => {
    const subscribe = onSnapshot(collection(db, "settings"), async (snapshot) => {
      const status: any= snapshot.docs.map(
        (doc) => doc.data()
      );
      if (status[0].generateCoin) {
        await generateCoinList();
      }
      if (status[0].realTime) {
        await getRTCoinsMarket();
      }
    });
    return subscribe;
  }, []);


  React.useEffect(() => {
    const subscribe = onSnapshot(collection(db, "coinLists"), (snapshot) => {
      const coins: IMarket[] = snapshot.docs.map(
        (doc) => doc.data() as IMarket
      );
      setCoinList(coins);
      setUserCoinList(coins.filter((coin) => coin[VIEW.USER_VIEW]));
      setAnonymousCoinList(coins.filter((coin) => coin[VIEW.ANONYMOUS_VIEW]));
      setLoading(false);
      getCoinLists();
    });
    return subscribe;
  }, [userData]);

  return (
    <CoinListContext.Provider
      value={{
        coinList,
        loading,
        favoriteList,
        userCoinList,
        anonymousCoinList,
        hiddenCoins,
        favoriteLoading,
      }}
    >
      {children}
    </CoinListContext.Provider>
  );
};

export const useCoinList = () => React.useContext(CoinListContext);
