import { FormControl } from '@angular/forms';

export type SearchType = 'album' | 'artist';

export interface SpotifySearchForm {
  search: FormControl<string | undefined>;
  type: FormControl<SearchType | undefined>;
}

export interface TypeOption {
  value: SearchType | undefined;
  text: string;
}

export interface SearchValues {
  search: string;
  type: SearchType;
}

export interface ImageItemInfo {
  height: number;
  url: string;
  width: number;
}

export interface ResultSearchBase {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface ArtistResultItemBase {
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ArtistResultItem extends ArtistResultItemBase {
  followers: {
    href: null;
    total: number;
  };
  genres: string[];
  images: ImageItemInfo[];
  popularity: number;
}

export interface ArtistSearchResult extends ResultSearchBase {
  items: ArtistResultItem[];
}
export interface ArtistSearchResponse {
  artists: ArtistSearchResult;
}

export interface AlbumResultItem {
  album_type: string;
  artists: ArtistResultItemBase[];
  available_markets: string[];
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  images: ImageItemInfo[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  uri: string;
}

export interface AlbumSearchResult extends ResultSearchBase {
  items: AlbumResultItem[];
}

export interface AlbumSearchResponse {
  albums: AlbumSearchResult;
}
