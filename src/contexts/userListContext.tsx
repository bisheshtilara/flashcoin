import { IList } from "@/actions/lists";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { collection, onSnapshot } from "firebase/firestore";
import React from "react";

const UserListContext = React.createContext<{
  lists: IList[];
  loading: boolean;
}>({
  lists: [],
  loading: true,
});

export const UserListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userData } = useAuth();
  const [lists, setLists] = React.useState<IList[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const subscribe = onSnapshot(
      collection(db, `users/${userData?.id}/lists`),
      (snapshot) => {
        setLists(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as IList))
        );
        setLoading(false);
      }
    );
    return subscribe;
  }, [userData]);

  return (
    <UserListContext.Provider value={{ lists, loading }}>
      {children}
    </UserListContext.Provider>
  );
};

export const useUserList = () => React.useContext(UserListContext);
