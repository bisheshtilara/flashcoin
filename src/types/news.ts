export interface Sources {
  "image/webp": string;
  "image/jpeg": string;
}

export interface Mobile {
  src: string;
  width: number;
  height: number;
  sources: Sources;
}

export interface Tablet {
  src: string;
  width: number;
  height: number;
  sources: Sources;
}

export interface Desktop {
  src: string;
  width: number;
  height: number;
  sources: Sources;
}

export interface Image {
  alt: string;
  type: string;
  mobile: Mobile;
  tablet: Tablet;
  desktop: Desktop;
}

export interface Subheadlines {
  basic: string;
}

export interface CoinDeskItem {
  _id: string;
  url: string;
  title: string;
  image: Image;
  date: string;
  subheadlines: Subheadlines;
}

export type CoinDesk = CoinDeskItem[];

export interface BinanceItem {
  id: number;
  title: string;
  body: string;
  bodyWithSchema: string;
  keywords: string[];
  thumbs: number;
  shareCount: number;
  coins: any[];
  createTime: number;
  version: string;
  coverPic?: any;
  sharingPicLink: string;
  sharingPicLinkTC?: any;
  tags: any[];
}

export type Binance = BinanceItem[];

export interface AuthorTranslate {
  cacheKey: string;
  id: string;
  name: string;
}

export interface Author {
  cacheKey: string;
  id: string;
  slug: string;
  authorTranslates: AuthorTranslate[];
}

export interface PostTranslate {
  cacheKey: string;
  id: string;
  title: string;
  avatar: string;
  published: Date;
  publishedHumanFormat: string;
  leadText: string;
  author: Author;
}

export interface CategoryTranslate {
  cacheKey: string;
  id: string;
  title: string;
}

export interface Category {
  cacheKey: string;
  id: string;
  slug: string;
  categoryTranslates: CategoryTranslate[];
}



export interface PostBadgeTranslate {
  cacheKey: string;
  id: string;
  title: string;
}

export interface PostBadge {
  cacheKey: string;
  id: string;
  label: string;
  postBadgeTranslates: PostBadgeTranslate[];
}

export interface CoinTelegraphItem {
  cacheKey: string;
  id: string;
  slug: string;
  views: number;
  postTranslate: PostTranslate;
  category: Category;
  author: Author;
  postBadge: PostBadge;
  showShares: boolean;
  showStats: boolean;
}

export type CoinTelegraph = CoinTelegraphItem[];

export interface NewsItem {
  id: string;
  source: { image: string; name: string };
  image: string;
  header: string;
  shortcut: string;
  date: number;
  likes: number;
  url: string;
}
