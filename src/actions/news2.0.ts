import axios from "axios";
import { db } from "@/firebase";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
const BINANCE_URL =
  "https://www.binance.com/bapi/composite/v1/public/cms/flashContent/query?pageNo=1&pageSize=50&isTransform=false&tagId=";

const newCatcherApiKey = import.meta.env.VITE_NEWS_CATCHER_API_KEY;
const newsCatcherUrl = import.meta.env.VITE_NEWS_CATCHER_URL;
const headers = { "x-api-key": newCatcherApiKey };
const newsCollection = "news";

const getHistoryDateNews = async () => {
  try {
    const docRef = doc(db, newsCollection, "historyDate");
    const docSnap = await getDoc(docRef);
    let historyDate;
    if (docSnap.exists()) {
      historyDate = docSnap.data();
    }
    return historyDate?.historyDate;
  } catch (e) {
    console.log(`Error: ${e}`);
  }
};

export const updateNews = async (id: string, active: boolean) => {
  try {
    await setDoc(doc(db, newsCollection, id), { active }, { merge: true });
  } catch (e) {
    console.log(`Error: ${e}`);
  }
};

export enum NEWS_SOURCE {
  BINANCE = "binance",
  NEWS_CATCHER = "newsCatcher",
}

export interface INews {
  id: string;
  source: {
    name: string;
    image: string;
  };
  image: string;
  header: string;
  shortcut: string;
  date: string;
  likes: number;
  url: string;
  active: boolean;
  newsSource: NEWS_SOURCE;
  historyDate?: string;
}

const generateNewsFromNewsCatcher = async (keywords: string, today: Date) => {
  const news = (
    await axios.get(
      `${newsCatcherUrl}/search?q=crypto&from='${today.getFullYear()}/${
        today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1
      }/${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}'&lang=en&topic=finance&page_size=100`,
      { headers }
    )
  ).data.articles;

  const formattedNews: INews[] = [];
  news.map(async (article: any) => {
    const newNews = {
      id: article._id,
      source: {
        name: article?.clean_url ? article.clean_url : "NewsCatcher",
        image:
          "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/dpduevosmxxnicjz6nbr",
      },
      image: article?.media
        ? article.media
        : "https://www.tbstat.com/wp/uploads/2022/08/20220804_Solana-3-1200x675.jpg",
      header: article.title,
      shortcut: article.summary,
      date: article.published_date,
      likes: article.rank,
      url: article.link,
      active: true,
      newsSource: NEWS_SOURCE.NEWS_CATCHER,
    };
    formattedNews.push(newNews);
  });
  formattedNews.map(async (item) => {
    await setDoc(doc(db, newsCollection, item.id), item);
  });
};

const generateNewsFromBinance = async (keywords: string, today: Date) => {
  const news = (await axios.get(BINANCE_URL)).data.data.contents;
  const formattedNews: INews[] = [];
  news.map(async (item: any) => {
    const newNews = {
      id: item.id.toString(),
      date: item.createTime,
      header: item.title,
      image:
        "https://www.tbstat.com/wp/uploads/2022/08/20220804_Solana-3-1200x675.jpg",
      likes: item.thumbs,
      shortcut: item.body,
      source: {
        image:
          "https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png",
        name: "Binance",
      },
      url: `https://www.binance.com/en/news/flash/${item.id}`,
      active: true,
      newsSource: NEWS_SOURCE.BINANCE,
    };
    formattedNews.push(newNews);
  });

  formattedNews.map(async (item) => {
    await setDoc(doc(db, newsCollection, item.id), item);
  });
};

export const generateNews = async (keywords: string) => {
  try {
    const today = new Date();
    let historyDate = await getHistoryDateNews();

    if (
      historyDate &&
      today.getDate() === new Date(historyDate).getDate() &&
      today.getMonth() === new Date(historyDate).getMonth() &&
      today.getFullYear() === new Date(historyDate).getFullYear()
    ) {
      return;
    } else {
      await generateNewsFromNewsCatcher(keywords, today);
      await generateNewsFromBinance(keywords, today);
      await setDoc(doc(db, newsCollection, "historyDate"), {
        historyDate: today.toISOString(),
      });
    }
  } catch (e) {
    //do nothing
  }
};

export const getAllNews = async () => {
  try {
    //TODO get keywords from user
    await generateNews("");
    const querySnapshot = await getDocs(collection(db, newsCollection));
    return querySnapshot.docs.map((doc) => doc.data() as INews);
  } catch (e) {
    // console.log(`Error: ${e}`);
  }
};
