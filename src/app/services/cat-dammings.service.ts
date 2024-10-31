import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { DammingsInfoItem, DammingsInfoResponse } from '../models/cat-dammings/cat-dammings.model';

@Injectable({
  providedIn: 'any',
})
export class CatDammingsService {
  private readonly URL =
    'https://analisi.transparenciacatalunya.cat/resource/gn9e-3qhr.json';

  private readonly http!: HttpClient;

  maxDate!: Date;
  minDate!: Date;

  constructor() {
    this.http = inject(HttpClient);
  }

  loadData(): void {
    this.http
      .get<DammingsInfoResponse[]>(this.URL)
      .pipe(
        take(1),
        map((result: DammingsInfoResponse[]) => {
          const list: DammingsInfoItem[] = result.map((item: DammingsInfoResponse) => {
            this.setMaxMinDate(item.dia);

            return {
              ...item,
              id: uuidv4(),
              id_estaci: ''
            };
          });

          return list;
        })
      )
      .subscribe((data: DammingsInfoItem[]) => {
        console.log(data);
        console.log(this.maxDate.toLocaleDateString());
        console.log(this.minDate.toLocaleDateString());
      });
  }

  setMaxMinDate(date: string): void {
    const currentValue = new Date(date).getTime();
    const maxValue = this.maxDate?.getTime();
    const minValue = this.minDate?.getTime();

    if (!maxValue || currentValue > maxValue) {
      this.maxDate = new Date(date);
    }

    if (!minValue || currentValue < minValue) {
      this.minDate = new Date(date);
    }
  }
}
