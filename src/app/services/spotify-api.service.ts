import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import {
  AlbumSearchResponse,
  AlbumSearchResult,
  ArtistSearchResponse,
  ArtistSearchResult,
  SearchType,
} from '../models/spotify-api/spotify-api.model';
import {
  TokenCheckInfo,
  TokenInfo,
  TokenStored,
} from '../models/token/token.model';
import { SPOTIFY_REQUEST } from '../utils/http-context.util';

export const TOKEN_STORE_KEY = 'token';

@Injectable({
  providedIn: 'any',
})
export class SpotifyAPIService {
  private readonly CLIENT = '40a7ec852b9f4dbb9daaedd86ab8239a';
  private readonly SECRET = '70263a73066d41229e51903cd81bf9d9';

  private readonly http!: HttpClient;

  private readonly BASE_URL = 'https://api.spotify.com/v1/';

  context = new HttpContext().set(SPOTIFY_REQUEST, true);

  constructor() {
    this.http = inject(HttpClient);
  }

  private getTimeInSeconds(): number {
    return Math.trunc(new Date().getTime() / 100);
  }

  private getTokenString(token: TokenInfo): string {
    return `${token.token_type} ${token.access_token}`;
  }

  saveToken(token: TokenInfo): void {
    const tokenStored: TokenStored = {
      token,
      time: this.getTimeInSeconds(),
    };

    sessionStorage.setItem(TOKEN_STORE_KEY, JSON.stringify(tokenStored));
  }

  checkToken(): TokenCheckInfo {
    const keyInfo = sessionStorage.getItem(TOKEN_STORE_KEY);

    if (!keyInfo) {
      return {
        isOk: false,
      };
    }

    const tokenStored: TokenStored = JSON.parse(keyInfo);

    const expireTime = tokenStored.time + tokenStored.token.expires_in;
    const currentTime = this.getTimeInSeconds();

    if (currentTime > expireTime) {
      return {
        isOk: false,
      };
    }

    return {
      isOk: true,
      token: this.getTokenString(tokenStored.token),
    };
  }

  getToken(): Observable<string> {
    const tokenInfo = this.checkToken();

    if (tokenInfo.isOk && tokenInfo.token) {
      return of(tokenInfo.token);
    }

    const body = `grant_type=client_credentials&client_id=${this.CLIENT}&client_secret=${this.SECRET}`;
    return this.http
      .post<TokenInfo>('https://accounts.spotify.com/api/token', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        tap((token: TokenInfo) => this.saveToken(token)),
        map((token: TokenInfo) => this.getTokenString(token))
      );
  }

  getArtist() {
    return this.http.get(
      'https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg',
      {
        context: this.context,
      }
    );
  }

  search(
    search: string,
    type: SearchType,
    page?: number,
    offset?: number
  ): Observable<ArtistSearchResponse | AlbumSearchResponse> {
    let params = new HttpParams().append('q', search).append('type', type);

    if (page) {
      params = params.append('page', page);
    }

    if (offset) {
      params = params.append('offset', offset);
    }

    return this.http.get<ArtistSearchResponse | AlbumSearchResponse>(
      `${this.BASE_URL}search`,
      {
        context: this.context,
        params,
      }
    );
  }
}
