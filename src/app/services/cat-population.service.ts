import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PopulationDataResponse } from '../models/cat-population/population-response.model';
import {
  ZipCodeItem,
  ZipCodeListItem,
} from '../models/cat-population/zip-codes.model';
import { NO_CACHE } from '../utils/http-context.util';

@Injectable({
  providedIn: 'any',
})
export class CatPopulationService {
  /**
   * Servicio de Angular para realizar llamadas HTTP
   */
  private readonly httpClient!: HttpClient;

  /**
   * Url con los datos de códigos postales
   */
  private readonly zipCodesApiURL =
    'https://analisi.transparenciacatalunya.cat/resource/tp8v-a58g.json';
  /**
   * Url con los datos de población
   */
  private readonly populationDataApiURL =
    'https://analisi.transparenciacatalunya.cat/resource/b4rr-d25b.json';

  /**
   * Método constructor
   */
  constructor() {
    this.httpClient = inject(HttpClient);
  }

  /**
   * Obtiene la lista de códigos postales de la Generalitat
   * @returns {Observable<ZipCodeListItem[]>} Observable con un array de códigos postales
   */
  getZipCodes(): Observable<ZipCodeListItem[]> {
    const params = new HttpParams().append('$limit', 9999);

    const context = new HttpContext().set(NO_CACHE, true);

    return this.httpClient
      .get<ZipCodeItem[]>(`${this.zipCodesApiURL}`, {
        params,
        context,
      })
      .pipe(map((list: ZipCodeItem[]) => this._mapZipCodeListItem(list)));
  }

  /**
   * Modifica la respuesta de la lista de códigos postales recibida del servicio para usarla en la aplicación
   * @param {ZipCodeItem} list Lista de códigos postales recibidos del servicio
   * @returns {ZipCodeListItem} Lista de códigos postales para usar en la aplicación
   */
  private _mapZipCodeListItem(list: ZipCodeItem[]): ZipCodeListItem[] {
    const codesMap: Map<string, ZipCodeListItem> = new Map<
      string,
      ZipCodeListItem
    >();

    list.forEach((item: ZipCodeItem) => {
      if (codesMap.has(item.codi_municipi)) {
        const currentPostalCodes =
          codesMap.get(item.codi_municipi)?.codi_postal || [];
        codesMap.set(item.codi_municipi, {
          id: window.crypto.randomUUID(),
          codi_municipi: item.codi_municipi,
          codi_postal: [...currentPostalCodes, item.codi_postal],
          nom_municipi: item.nom_municipi,
        });
      } else {
        codesMap.set(item.codi_municipi, {
          id: window.crypto.randomUUID(),
          codi_municipi: item.codi_municipi,
          codi_postal: [item.codi_postal],
          nom_municipi: item.nom_municipi,
        });
      }
    });

    return Array.from(codesMap.values()) || [];
  }

  /**
   * Obtiene datos de una población
   * @param {string} code Código de la población a consultar sus datos
   * @returns {Observable<PopulationDataResponse[]>} Lista con los datos de la población
   */
  getPopulationData(code: string): Observable<PopulationDataResponse[]> {
    const params = new HttpParams().append('codi', code);

    const context = new HttpContext().set(NO_CACHE, true);

    return this.httpClient.get<PopulationDataResponse[]>(
      this.populationDataApiURL,
      {
        params,
        context,
      }
    );
  }
}
