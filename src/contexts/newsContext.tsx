import { getAllNews, INews } from "@/actions/news2.0";
import { getTopMovers, ITopMovers } from "@/actions/topMovers";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect } from "react";

const NewsContext = React.createContext<{
  news: INews[];
  topMovers: ITopMovers[];
  loading: boolean;
  newsAdmin: INews[];
}>({
  news: [],
  topMovers: [],
  loading: true,
  newsAdmin: [],
});

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [news, setNews] = React.useState<INews[]>([]);
  const [topMovers, setTopMovers] = React.useState<ITopMovers[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [newsLoading, setNewsLoading] = React.useState<boolean>(true);
  const [topMoversLoading, setTopMoversLoading] = React.useState<boolean>(true);
  const [newsAdmin, setNewsAdmin] = React.useState<INews[]>([]);

  const { userData } = useAuth();

  React.useEffect(() => {
    const fetchNews = async () => {
      const data = await getAllNews();
      if (!data) return;
      setNewsAdmin(data);
      const newData = data.filter((item) => item.active);
      filterKeywords(newData);
      setNewsLoading(false);
    };
    const fetchTopMovers = async () => {
      const data = await getTopMovers();
      if (!data) return;
      setTopMovers(data);
      setTopMoversLoading(false);
    };
    fetchNews();
    fetchTopMovers();

    const subscribe = onSnapshot(collection(db, `news`), (snapshot) => {
      setNewsAdmin(snapshot.docs.map((doc) => ({ ...doc.data() } as INews)));
      setLoading(false);
    });
    return subscribe;
  }, []);

  const getNewsWhenKeywordsChange = async () => {
    if (userData && userData.id && userData.keywords) {
      const data = await getAllNews();
      if (!data) return;
      const newData = data.filter((item) => item.active);

      const unsub = onSnapshot(
        collection(db, `users/${userData.id}/keywords`),
        (doc) => {
          if (!data) return;
          
          filterKeywords(newData);
        }
      );
      return unsub;
    }
  }

  React.useEffect(() => {
    getNewsWhenKeywordsChange();
  }, [userData]);

  const filterKeywords = (news: INews[]) => {
    if (news.length > 0) {
      if (userData && userData.keywords && userData.keywords.length > 0) {
        let newNews: INews[] = [];
        news.forEach((item) => {
          if (!item?.historyDate) {
            const concatNews = item.header + item.shortcut + item.source.name;
            for (const keyword of userData.keywords) {
              if (concatNews.toLowerCase().includes(keyword.toLowerCase())) {
                newNews.push(item);
              }
            }
          }
        });
        setNews(newNews);
      } else {
        setNews(news);
      }
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (!newsLoading && !topMoversLoading) {
      setLoading(false);
    }
  }, [newsLoading, topMoversLoading]);
  return (
    <NewsContext.Provider value={{ news, topMovers, loading, newsAdmin }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => React.useContext(NewsContext);
