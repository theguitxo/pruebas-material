import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  parkAttractions: ['Celebrate the Magic', 'Jingle Bell, Jingle BAM!'];
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

  constructor() {
    this.httpClient = inject(HttpClient);
  }

  getAllCharacters(): Observable<ResponseCharacterList> {
    return this.httpClient.get<ResponseCharacterList>(
      `${this.baseURL}/character`
    );
  }
}
