import { INews, NEWS_SOURCE } from "@/actions/news2.0";
import TextInput from "@/components/commons/TextInput";
import { useNews } from "@/contexts/newsContext";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { NewspaperIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import React from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { NewsCard } from "./Home";
import { UserPrefs } from "./Profile";

enum OPTION_DISPLAY {
  ALL = "ALL",
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
}

const EditNews: React.FC = () => {
  const [duplicateNews, setDuplicateNews] = React.useState<INews[]>([]);
  const [sourceSelected, setSourceSelected] =
    React.useState<NEWS_SOURCE | null>();
  const [date, setDate] = React.useState<string>("");
  const [optionDisplay, setOptionDisplay] = React.useState<OPTION_DISPLAY>(
    OPTION_DISPLAY.ALL
  );
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const { newsAdmin, loading } = useNews();

  React.useEffect(() => {
    if (newsAdmin.length > 0) {
      let res = filterDate(newsAdmin);
      res = filterOption(res);
      res = filterKeyword(res);
      res = FilterSource(res);
      setDuplicateNews(res);
    }
  }, [newsAdmin]);

  const FilterSource = (news : INews[]) => {
    if (sourceSelected) {
        return news.filter((item) => item.newsSource === sourceSelected)
    } else {
      return news
    }
  }

  React.useEffect(() => {

    let res = FilterSource(newsAdmin);
    res = filterDate(res);
    res = filterOption(res);
    res = filterKeyword(res);
    setDuplicateNews(res);
  }, [sourceSelected]);

  const filterDate = (news : INews[]) => {
    if (date !== "") {
        return news.filter(
          (item) => moment(item.date).format("YYYY-MM-DD") === date
        )
    } else {
      return news;
    }
  }

  React.useEffect(() => {
    let res = filterDate(newsAdmin);
    res = filterOption(res);
    res = filterKeyword(res);
    res = FilterSource(res);
    setDuplicateNews(res);
  }, [date]);

  const filterOption = (news : INews[]) => {
    if (optionDisplay === OPTION_DISPLAY.ENABLE) {
      return news.filter((item) => item.active);
    } else if (optionDisplay === OPTION_DISPLAY.DISABLE) {
      return news.filter((item) => !item.active)
    } else {
      return news;
    }
  }

  React.useEffect(() => {
    let res = filterOption(newsAdmin);
    res = filterDate(res);
    res = filterKeyword(res);
    res = FilterSource(res);
    setDuplicateNews(res);
  }, [optionDisplay]);

  const filterKeyword = (news : INews[]) => {
    return news.filter((item) => {
      if (!item?.historyDate) {
        const concatNews = item.header + item.shortcut + item.source.name;
        return keywords.every((keyword) =>
          concatNews.toLowerCase().includes(keyword.toLowerCase())
        );
      }
    })
  }

  React.useEffect(() => {
    let res = filterKeyword(newsAdmin);
    res = filterDate(res);
    res = filterOption(res);
    res = FilterSource(res);
    setDuplicateNews(res);
  }, [keywords]);

  const handleSearch = (value: string) => {
    setDuplicateNews(
      newsAdmin.filter((item) => {
        if (!item?.historyDate) {
          const concatNews = item.header + item.shortcut + item.source.name;
          return concatNews.toLowerCase().includes(value.toLowerCase());
        }
      })
    );
  };

  const handleOnRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((item, i) => i !== index));
  };

  const handleOnAddKeyword = (value: string) => {
    setKeywords([...keywords, value]);
  };

  return (
    <div className="grid grid-cols-10 h-full w-full">
      <div className="col-span-7">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <ClimbingBoxLoader color="red" size={25} />
          </div>
        ) : (
          <div className="flex flex-col gap-8 p-16 overflow-y-scroll h-screen scrollbar-hide w-full">
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
                <NewsCard news={news} admin key={index}/>
              ))}
          </div>
        )}
      </div>
      <div
        className="col-span-3 shadow-2xl flex flex-col space-y-4 p-4"
        role="right"
      >
        <div
          role="source"
          className="flex gap-6 text-slate-300 font-semibold justify-center"
        >
          <div
            onClick={() => setSourceSelected(null)}
            className={`grid gap-1 cursor-pointer hover:scale-110 duration-300 ${
              !sourceSelected ? "text-red-600" : ""
            }`}
          >
            <span>All</span>
            <div
              className={`h-2 ${
                !sourceSelected ? "bg-red-600" : "bg-slate-300"
              }`}
            />
          </div>
          <div
            onClick={() => setSourceSelected(NEWS_SOURCE.BINANCE)}
            className={`grid gap-1 cursor-pointer hover:scale-110 duration-300 ${
              sourceSelected === NEWS_SOURCE.BINANCE ? "text-red-600" : ""
            }`}
          >
            <span>Binance</span>
            <div
              className={`h-2 ${
                sourceSelected === NEWS_SOURCE.BINANCE
                  ? "bg-red-600"
                  : "bg-slate-300"
              }`}
            />
          </div>
          <div
            onClick={() => setSourceSelected(NEWS_SOURCE.NEWS_CATCHER)}
            className={`grid gap-1 cursor-pointer hover:scale-110 duration-300 ${
              sourceSelected === NEWS_SOURCE.NEWS_CATCHER ? "text-red-600" : ""
            }`}
          >
            <span>News catcher</span>
            <div
              className={`h-2 ${
                sourceSelected === NEWS_SOURCE.NEWS_CATCHER
                  ? "bg-red-600"
                  : "bg-slate-300"
              }`}
            />
          </div>
        </div>
        <div
          role="Date"
          className="rounded-xl border shadow-lg p-4 flex flex-col space-y-4"
        >
          <div className="flex space-x-4">
            <CalendarDaysIcon className="h-6 w-6 text-orange-600" />
            <span className="text-orange-600 font-semibold text-xl">Date</span>
          </div>
          <div className="flex gap-1 w-full">
            <input
              type="date"
              className="border border-slate-400 rounded-lg p-2 w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              onClick={() => setDate("")}
              className="text-white bg-red-600 p-2 rounded-lg border border-red-600"
            >
              Clear
            </button>
          </div>
        </div>
        <div
          role="enableButton"
          className="flex flex-col gap-4 p-4 border shadow-lg rounded-lg"
        >
          <div className="flex space-x-4">
            <NewspaperIcon className="h-6 w-6 text-orange-600" />
            <span className="text-orange-600 font-semibold text-xl">News</span>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setOptionDisplay(OPTION_DISPLAY.ALL)}
              className={`${
                optionDisplay === OPTION_DISPLAY.ALL
                  ? "bg-red-600 text-white italic"
                  : ""
              } p-2 rounded-xl shadow-lg border hover:scale-110 duration-300`}
            >
              All news
            </button>
            <button
              onClick={() => setOptionDisplay(OPTION_DISPLAY.ENABLE)}
              className={`${
                optionDisplay === OPTION_DISPLAY.ENABLE
                  ? "bg-red-600 text-white italic"
                  : ""
              } p-2 rounded-xl shadow-lg border hover:scale-110 duration-300`}
            >
              Enable
            </button>
            <button
              onClick={() => setOptionDisplay(OPTION_DISPLAY.DISABLE)}
              className={`${
                optionDisplay === OPTION_DISPLAY.DISABLE
                  ? "bg-red-600 text-white italic"
                  : ""
              } p-2 rounded-xl shadow-lg border hover:scale-110 duration-300`}
            >
              Disable
            </button>
          </div>
        </div>
        <div role="keywords">
          <UserPrefs
            prefArray={keywords}
            label="keywords"
            keyword
            onAdd={handleOnAddKeyword}
            onRemove={handleOnRemoveKeyword}
          />
        </div>
      </div>
    </div>
  );
};

export default EditNews;
