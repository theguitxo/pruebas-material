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
  providedIn: 'root',
})
export class CatPopulationService {
  private readonly httpClient!: HttpClient;

  private readonly zipCodesApiURL =
    'https://analisi.transparenciacatalunya.cat/resource/tp8v-a58g.json';
  private readonly populationDataApiURL =
    'https://analisi.transparenciacatalunya.cat/resource/b4rr-d25b.json';

  constructor() {
    this.httpClient = inject(HttpClient);
  }

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
          codi_municipi: item.codi_municipi,
          codi_postal: [...currentPostalCodes, item.codi_postal],
          nom_municipi: item.nom_municipi,
        });
      } else {
        codesMap.set(item.codi_municipi, {
          codi_municipi: item.codi_municipi,
          codi_postal: [item.codi_postal],
          nom_municipi: item.nom_municipi,
        });
      }
    });

    return Array.from(codesMap.values()) || [];
  }

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
