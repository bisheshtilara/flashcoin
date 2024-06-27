import React from "react";

import ChartsCoinLists from "@/components/ChartsCoinLists";
import { useCoinList } from "@/contexts/coinListContext";
import { useAuth } from "@/hooks/useAuth";

const Charts: React.FC = () => {
  const { userCoinList, anonymousCoinList, loading } = useCoinList();
  const { user } = useAuth();
  
  return (
    <ChartsCoinLists
      coinList={user ? userCoinList : anonymousCoinList}
      loading={loading}
    />
  );
};

export default Charts;
