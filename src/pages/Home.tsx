import { INews, updateNews } from "@/actions/news2.0";
import TextInput from "@/components/commons/TextInput";
import { useNews } from "@/contexts/newsContext";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HeartIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/solid";
import moment from "moment";
import React from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Steps } from "intro.js-react";

const steps: { element: string; intro: string; position?: string }[] = [
  {
    element: "#sidebar",
    intro: "Click here to open the sidebar to see a list of the top movers.",
    position: "left",
  },
];
const Home: React.FC = ({}) => {
  const [stepsEnabled, setStepsEnabled] = React.useState<boolean>(
    localStorage.getItem("firstNews") ? true : false
  );
  React.useEffect(() => {
    if (localStorage.getItem("firstNews")) setStepsEnabled(true);
  }, [localStorage.getItem("firstNews")]);

  const [showMovers, setShowMovers] = React.useState<boolean>(false);
  const [duplicateNews, setDuplicateNews] = React.useState<INews[]>([]);
  const { news, topMovers, loading } = useNews();
  const { userData } = useAuth();

  const handleSearch = (value: string) => {
    setDuplicateNews(
      news.filter((item) => {
        if (!item?.historyDate) {
          const concatNews = item.header + item.shortcut + item.source.name;
          return concatNews.toLowerCase().includes(value.toLowerCase());
        }
      })
    );
  };

  React.useEffect(() => {
    if (news.length > 0) {
      setDuplicateNews(news);
    }
  }, [news]);

  return (
    <>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <ClimbingBoxLoader color="red" size={25} />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-8 p-16 w-full h-full overflow-y-scroll scrollbar-hide">
            <div className="sticky top-0 grid grid-cols-4 z-50">
              <div className="col-span-3" />
              <TextInput
                label="Search News"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {duplicateNews
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((news, index) => (
                <NewsCard news={news} key={index} />
              ))}
          </div>
          {/* Sidebar */}
          <div
            className={`bg-white shadow-2xl rounded-3xl z-50 p-8 absolute top-0 right-0 h-full w-[22.5rem] overflow-y-scroll tracking-tighter transition-all ease-in-out duration-500 ${
              showMovers ? "" : "translate-x-full"
            }`}
          >
            <div className="flex items-start justify-between flex-1">
              <p className="text-2xl font-medium pb-8">Top Movers</p>
              <div
                role="button"
                onClick={() => setShowMovers(!showMovers)}
                className="transition-all ease-in-out hover:translate-x-2"
              >
                <ChevronDoubleRightIcon className="h-7 text-black" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {topMovers.map(
                (
                  { name, image, symbol, priceUsd, changePercent24Hr },
                  index
                ) => {
                  return (
                    <div key={index}>
                      <div className="flex items-center gap-3">
                        <img
                          src={image}
                          alt="Mover Logo"
                          className="h-12 rounded-full"
                        />
                        <div className="flex items-center justify-between flex-1 text-lg">
                          <div className="flex flex-col">
                            <p className="font-medium">{name}</p>
                            <p className="font-light tracking-wide text-gray-500">
                              {symbol}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <p className="font-medium">
                              ${Number(priceUsd).toFixed(2)}
                            </p>
                            <div className="flex items-center gap-1">
                              <p
                                className={`${
                                  changePercent24Hr.includes("-")
                                    ? "text-red-500"
                                    : "text-green-500"
                                } font-light`}
                              >
                                {Number(changePercent24Hr).toFixed(2)}%
                              </p>
                              {changePercent24Hr.includes("-") ? (
                                <ArrowDownIcon className="h-4 text-red-500" />
                              ) : (
                                <ArrowUpIcon className="h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          {!showMovers && (
            <div
              role="button"
              className="absolute top-0 right-0 h-full w-12 flex items-center justify-center bg-gray-100 transition-all ease-in-out hover:-translate-x-2"
              onClick={() => setShowMovers(!showMovers)}
              id="sidebar"
            >
              <ChevronDoubleLeftIcon className="h-8 text-black" />
            </div>
          )}
        </>
      )}
      {loading ? null : (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={0}
          onExit={() => {
            setStepsEnabled(false);
            localStorage.removeItem("firstNews");
          }}
        />
      )}
    </>
  );
};

export default Home;

interface INewsCard {
  news: INews;
  admin?: boolean;
}

export const NewsCard: React.FC<INewsCard> = ({ news, admin = false }) => {
  const { source, image, header, shortcut, date, likes, url, active } = news;
  const handleUpdateNews = async () => {
    await updateNews(news.id, !active);
    active
      ? toast.info("News removed from your feed")
      : toast.info("News added to your feed");
  };

  return (
    <div
      className={`flex items-center gap-5 border border-gray-100 bg-white shadow-md px-5 py-12 tracking-tight rounded-3xl cursor-pointer transition-all ease-in-out hover:scale-95 duration-300 relative ${
        active ? "" : admin ? "opacity-50" : ""
      }`}
      onClick={() => window.open(url, "_blank")}
    >
      {admin ? (
        active ? (
          <MinusCircleIcon
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateNews();
            }}
            className="h-8 text-red-500 absolute -top-2 -right-2 hover:-translate-y-3 duration-300"
          />
        ) : (
          <PlusCircleIcon
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateNews();
            }}
            className="h-8 text-green-500 absolute -top-2 -right-2 hover:-translate-y-3 duration-300"
          />
        )
      ) : null}
      <img src={image} alt="News Logo" className="h-44 w-52 rounded-3xl" />
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-semibold tracking-tighter">
            <img
              src={
                source?.image
                  ? source.image
                  : "https://rapidapi-prod-apis.s3.amazonaws.com/54ac689a-9f25-4e8e-90ff-2f574fa7c158.png"
              }
              alt="Web Logo"
              className="h-10 rounded-full"
            />
            <p>{source?.name ? source.name : "FlashCoin"}</p>
          </div>
          <p className="font-light text-sm">
            {moment(new Date(date)).format("MMMM Do, YYYY")}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p
            className={`truncate ${
              admin ? "max-w-xl" : "max-w-5xl"
            }  font-medium text-lg`}
          >
            {header}
          </p>
          <p
            className={` ${
              admin ? "max-w-lg" : "max-w-5xl"
            } line-clamp-2 text-gray-500 text-base tracking-wide`}
          >
            {shortcut}
          </p>
        </div>
      </div>
      {likes ? (
        <div className="absolute bottom-4 right-8 flex items-center gap-1">
          <HeartIcon className="h-5 text-red-600" />
          <p className="tracking-wider text-base font-regular">{likes}</p>
        </div>
      ) : null}
    </div>
  );
};
