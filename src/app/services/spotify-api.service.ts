import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import {
  AlbumSearchResponse,
  ArtistSearchResponse,
  SearchType,
} from '../models/spotify-api/spotify-api.model';
import {
  TokenCheckInfo,
  TokenInfo,
  TokenStored,
} from '../models/token/token.model';
import { SPOTIFY_REQUEST } from '../utils/http-context.util';

export const TOKEN_STORE_KEY = 'token';

/**
 * Servicio para hacer llamadas a la API de Spotify
 */
@Injectable({
  providedIn: 'any',
})
export class SpotifyAPIService {
  /**
   * Datos API Spotify: cliente
   */
  private readonly CLIENT = '40a7ec852b9f4dbb9daaedd86ab8239a';
  /**
   * Datos API Spotify: key
   */
  private readonly KEY = '70263a73066d41229e51903cd81bf9d9';
  /**
   * Servicio para llamadas http de Angular
   */
  private readonly http!: HttpClient;
  /**
   * Url de la API de Spotify
   */
  private readonly BASE_URL = 'https://api.spotify.com/v1/';
  /**
   * Contexto para indicar que son llamadas a la API de Spotify
   */
  context = new HttpContext().set(SPOTIFY_REQUEST, true);

  /**
   * Método constructor
   */
  constructor() {
    this.http = inject(HttpClient);
  }

  /**
   * Devuelve el tiempo actual en segundos
   * @returns {number} Tiempo actual en segundos
   */
  private getTimeInSeconds(): number {
    return Math.trunc(new Date().getTime() / 100);
  }

  /**
   * Devuelve el token de autenticación de la información recibida al iniciar / renovar sesión
   * @param  {TokenInfo} token Información del token recibido al iniciar / renovar sesión
   * @returns {string} Cadena de texto con el token de autenticación
   */
  private getTokenString(token: TokenInfo): string {
    return `${token.token_type} ${token.access_token}`;
  }

  /**
   * Guarda la informaciónm del token en el sessionStorage
   * @param {TokenInfo} token Información del token recibida al iniciar / renovar sesión
   */
  saveToken(token: TokenInfo): void {
    const tokenStored: TokenStored = {
      token,
      time: this.getTimeInSeconds(),
    };

    sessionStorage.setItem(TOKEN_STORE_KEY, JSON.stringify(tokenStored));
  }

  /**
   * Comprueba si ha caducado el token guardado en el sessionStorage
   * @returns {TokenCheckInfo} Objeto con información del token y su caducidad
   */
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

  /**
   * Obtiene el token de autenticación, lo guarda en el sessionStorage y devuelve una cadena con el valor
   * @returns {Observable<string>} Un observable con el token, como cadena de texto
   */
  getToken(): Observable<string> {
    const tokenInfo = this.checkToken();

    if (tokenInfo.isOk && tokenInfo.token) {
      return of(tokenInfo.token);
    }

    const body = `grant_type=client_credentials&client_id=${this.CLIENT}&client_secret=${this.KEY}`;
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

  /**
   * Hace una llamada al servicio de búsqueda de la API de Spotify
   * @param {string} search Cadena de texto a buscar
   * @param {SearchType} type Tipo de búqueda: Artista o Álbum
   * @param {number} limit Nümero de resultados por búsqueda
   * @param {number} offset Número de página para los resultados
   * @returns
   */
  search(
    search: string,
    type: SearchType,
    limit?: number,
    offset?: number
  ): Observable<ArtistSearchResponse | AlbumSearchResponse> {
    let params = new HttpParams().append('q', search).append('type', type);

    if (limit) {
      params = params.append('limit', limit);
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
