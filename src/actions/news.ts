import { Binance, CoinDesk, CoinTelegraph, NewsItem } from "@/types/news";

const COINDESK_URL =
  "https://www.coindesk.com/pf/api/v3/content/fetch/live-wire";
const COINTELEGRAPH_URL = "https://graphcdn.cointelegraph.com/";
const BINANCE_URL =
  "https://www.binance.com/bapi/composite/v1/public/cms/flashContent/query?pageNo=1&pageSize=20&isTransform=false&tagId=";

export const fetchNews = async () => {
  // const coinDesk = await fetch(COINDESK_URL)
  //   .then((res) => res.json())
  //   .then((data: CoinDesk) =>
  //     data.map(
  //       (item) =>
  //         ({
  //           id: item._id,
  //           date: new Date(item.date).getTime(),
  //           header: item.title,
  //           image: item?.image?.desktop?.src || "",
  //           likes: 0,
  //           shortcut: item.subheadlines.basic,
  //           source: {
  //             image:
  //               "https://www.pngitem.com/pimgs/m/610-6104395_don-t-miss-the-biggest-btc-party-of.png ",
  //             name: "CoinDesk",
  //           },
  //           url: `https://www.coindesk.com${item.url}`,
  //         } as NewsItem)
  //     )
  //   );

  // const coinTelegraph = await fetch(COINTELEGRAPH_URL, {
  //   method: "POST",
  //   body: '{\n    "operationName": "CategoryPagePostsQuery",\n    "variables": {\n        "slug": "latest-news",\n        "offset": 0,\n        "length": 15,\n        "hideFromMainPage": null,\n        "short": "en",\n        "cacheTimeInMS": 300000\n    },\n    "query": "query CategoryPagePostsQuery($short: String, $slug: String!, $offset: Int = 0, $length: Int = 10, $hideFromMainPage: Boolean = null) {\\n  locale(short: $short) {\\n category(slug: $slug) {\\n cacheKey\\n id\\n posts(\\n order: \\"postPublishedTime\\"\\n offset: $offset\\n length: $length\\n hideFromMainPage: $hideFromMainPage\\n ) {\\n data {\\n cacheKey\\n id\\n slug\\n views\\n  postTranslate {\\n cacheKey\\n id\\n title\\n avatar\\n published\\n publishedHumanFormat\\n leadText\\n author {\\n cacheKey\\n id\\n slug\\n authorTranslates {\\n cacheKey\\n id\\n name\\n }\\n }\\n }\\n  category {\\n cacheKey\\n id\\n slug\\n categoryTranslates {\\n cacheKey\\n id\\n title\\n }\\n }\\n author {\\n cacheKey\\n id\\n slug\\n authorTranslates {\\n cacheKey\\n id\\n name\\n }\\n }\\n postBadge {\\n cacheKey\\n id\\n label\\n postBadgeTranslates {\\n cacheKey\\n id\\n title\\n }\\n }\\n  showShares\\n  showStats\\n }\\n postsCount\\n }\\n }\\n }\\n}\\n"\n}',
  // })
  //   .then((res) => res.json())
  //   .then((body) => body.data.locale.category.posts.data)
  //   .then((data: CoinTelegraph) =>
  //     data.map(
  //       (item) =>
  //         ({
  //           id: item.id,
  //           date: new Date(item.postTranslate.published).getTime(),
  //           header: item.postTranslate.title,
  //           image: item.postTranslate.avatar,
  //           likes: 0,
  //           shortcut: item.postTranslate.leadText,
  //           source: {
  //             image:
  //               "https://www.pngitem.com/pimgs/m/53-531568_cointelegraph-logo-hd-png-download.png",
  //             name: "CoinTelegraph",
  //           },
  //         } as NewsItem)
  //     )
  //   );
  const binance = await fetch(BINANCE_URL)
    .then((res) => res.json())
    .then((body) => body.data.contents)
    .then((data: Binance) =>
      data.map(
        (item) =>
          ({
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
          } as NewsItem)
      )
    );
  return [...binance];
};
