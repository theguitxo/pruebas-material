import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  DammingsInfoItem,
  DammingsInfoResponse,
} from '../models/cat-dammings/cat-dammings.model';

@Injectable({
  providedIn: 'any',
})
export class CatDammingsService {
  private readonly URL =
    'https://analisi.transparenciacatalunya.cat/resource/gn9e-3qhr.json';

  private readonly http!: HttpClient;

  list!: DammingsInfoItem[];

  private readonly _maxDate: BehaviorSubject<Date | undefined> =
    new BehaviorSubject<Date | undefined>(undefined);
  private readonly _minDate: BehaviorSubject<Date | undefined> =
    new BehaviorSubject<Date | undefined>(undefined);

  get maxDate(): Observable<Date | undefined> {
    return this._maxDate.asObservable();
  }
  get minDate(): Observable<Date | undefined> {
    return this._minDate.asObservable();
  }

  constructor() {
    this.http = inject(HttpClient);
  }

  loadData(): void {
    this.http
      .get<DammingsInfoResponse[]>(this.URL)
      .pipe(
        take(1),
        tap((result: DammingsInfoResponse[]) => this.setStationsInfo(result))
      )
      .subscribe();
  }

  private setStationsInfo(data: DammingsInfoResponse[]): void {
    const stations = new Map<string, string>();
    let maxDate!: Date;
    let minDate!: Date;
    this.list = data.map((item: DammingsInfoResponse) => {
      [maxDate, minDate] = this.setMaxMinDate(
        new Date(item.dia),
        maxDate,
        minDate
      );
      let stationKey = stations.get(item.estaci);
      if (!stationKey) {
        stationKey = uuidv4();
        stations.set(item.estaci, stationKey);
      }
      return {
        ...item,
        id: uuidv4(),
        id_estaci: stationKey,
        date: new Date(item.dia),
      };
    });

    this._maxDate.next(maxDate);
    this._minDate.next(minDate);
  }

  private setMaxMinDate(date: Date, max: Date, min: Date): [Date, Date] {
    const currentValue = date.getTime();
    const maxValue = max?.getTime();
    const minValue = min?.getTime();
    const newMax = !max || currentValue > maxValue ? date : max;
    const newMin = !min || currentValue < minValue ? date : min;

    return [newMax, newMin];
  }
}
