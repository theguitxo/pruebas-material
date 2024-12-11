export interface ResponseInfo {
  totalPages?: number;
  count: number;
  previousPage?: string;
  nextPage?: string;
}

export interface ResponseData {
  _id: number;
  films: string[];
  shortFilms: string[];
  tvShows: string[];
  videoGames: string[];
  parkAttractions: string[];
  allies: [];
  enemies: [];
  sourceUrl?: string;
  name: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  url: string;
  __v?: 0;
}

export interface ResponseCharacterList {
  info: ResponseInfo;
  data: ResponseData[];
}

export interface ResponseCharacter {
  info: ResponseInfo;
  data: ResponseData;
}
