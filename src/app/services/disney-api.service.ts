import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class DisneyAPIService {
  private readonly httpClient!: HttpClient;

  private readonly baseURL = 'https://api.disneyapi.dev';

  pageSize = 5;
  currentPage = 1;

  private _charactersList: BehaviorSubject<ResponseCharacterList | undefined> =
    new BehaviorSubject<ResponseCharacterList | undefined>(undefined);

  get charactersList(): Observable<ResponseCharacterList | undefined> {
    return this._charactersList.asObservable();
  }

  constructor() {
    this.httpClient = inject(HttpClient);
  }

  getAllCharacters(): void {
    const params = this.setCommonParams();

    this.getHttpRequest(params);
  }

  filterCharacters(name: string): void {
    const params = this.setCommonParams().append('name', name);

    this.getHttpRequest(params);
  }

  setCommonParams(): HttpParams {
    return new HttpParams()
      .append('pageSize', this.pageSize)
      .append('page', this.currentPage);
  }

  getHttpRequest(params: HttpParams): void {
    this.httpClient
      .get<ResponseCharacterList>(`${this.baseURL}/character`, {
        params,
      })
      .subscribe((data) => this._charactersList.next(data));
  }
}
