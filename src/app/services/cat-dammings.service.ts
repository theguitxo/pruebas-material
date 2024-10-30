import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { DammingsInfoResponse } from '../models/cat-dammings/cat-dammings.model';

@Injectable({
  providedIn: 'any',
})
export class CatDammingsService {
  private readonly URL =
    'https://analisi.transparenciacatalunya.cat/resource/gn9e-3qhr.json';

  private readonly http!: HttpClient;

  dates: Set<string> = new Set<string>();

  constructor() {
    this.http = inject(HttpClient);
  }

  loadData(): void {
    this.http
      .get<DammingsInfoResponse[]>(this.URL)
      .pipe(
        take(1),
        tap((result: DammingsInfoResponse[]) => {
          result?.forEach((item: DammingsInfoResponse) => {
            if (!this.dates.has(item.dia)) {
              this.dates.add(item.dia);
            }
          });
        })
      )
      .subscribe(() => console.log(this.dates));
  }
}
