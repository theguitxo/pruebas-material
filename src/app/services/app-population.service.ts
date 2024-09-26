import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ZipCodeItem } from '../models/cat-population/zip-codes.model';
import { NO_CACHE } from '../utils/http-context.util';

@Injectable({
  providedIn: 'root',
})
export class CatPopulationService {
  private readonly httpClient!: HttpClient;

  private readonly zipCodesApiURL =
    'https://analisi.transparenciacatalunya.cat/resource/tp8v-a58g.json';
  private readonly charDataApiURL =
    'https://analisi.transparenciacatalunya.cat/resource/b4rr-d25b.json';

  constructor() {
    this.httpClient = inject(HttpClient);
  }

  getZipCodes(): Observable<ZipCodeItem[]> {
    const params = new HttpParams().append('$limit', 9999);

    const context = new HttpContext().set(NO_CACHE, true);

    return this.httpClient.get<ZipCodeItem[]>(`${this.zipCodesApiURL}`, {
      params,
      context,
    });
  }
}
