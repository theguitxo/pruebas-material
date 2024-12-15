import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ONE_DAY_MILISECONDS } from '../constants/common.constants';
import {
  DammingsInfoItem,
  DammingsInfoResponse,
  StationItem,
} from '../models/cat-dammings/cat-dammings.model';

@Injectable({
  providedIn: 'any',
})
export class CatDammingsService {
  private readonly URL =
    'https://analisi.transparenciacatalunya.cat/resource/gn9e-3qhr.json';

  private readonly http!: HttpClient;

  private readonly _maxDate: BehaviorSubject<Date | undefined> =
    new BehaviorSubject<Date | undefined>(undefined);
  private readonly _minDate: BehaviorSubject<Date | undefined> =
    new BehaviorSubject<Date | undefined>(undefined);
  private readonly _stations: BehaviorSubject<StationItem[] | undefined> =
    new BehaviorSubject<StationItem[] | undefined>(undefined);
  private readonly _list: BehaviorSubject<DammingsInfoItem[] | undefined> =
    new BehaviorSubject<DammingsInfoItem[] | undefined>(undefined);

  get maxDate(): Observable<Date | undefined> {
    return this._maxDate.asObservable();
  }
  get minDate(): Observable<Date | undefined> {
    return this._minDate.asObservable();
  }
  get stations(): Observable<StationItem[] | undefined> {
    return this._stations.asObservable();
  }
  get list(): Observable<DammingsInfoItem[] | undefined> {
    return this._list.asObservable();
  }

  /**
   * Método constructor
   */
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
    const { maxDate, minDate, stations, list } = this.setInfo(data);

    this._maxDate.next(maxDate);
    this._minDate.next(minDate);
    this._stations.next(stations);
    this._list.next(list);
  }

  private setInfo(data: DammingsInfoResponse[]): {
    maxDate: Date;
    minDate: Date;
    stations: StationItem[];
    list: DammingsInfoItem[];
  } {
    const stations: StationItem[] = [];
    const stationsListed = new Set<string>();
    let maxDate!: Date;
    let minDate!: Date;

    const list: DammingsInfoItem[] = data.map((item: DammingsInfoResponse) => {
      [maxDate, minDate] = this.setMaxMinDate(
        new Date(item.dia),
        maxDate,
        minDate
      );

      let stationKey = this.manageStationsList(stationsListed, item, stations);

      return {
        ...item,
        id: uuidv4(),
        id_estaci: stationKey,
        date: new Date(item.dia),
      };
    });

    return { maxDate, minDate, stations, list };
  }

  private setMaxMinDate(date: Date, max: Date, min: Date): [Date, Date] {
    const currentValue = date.getTime();
    const maxValue = max?.getTime();
    const minValue = min?.getTime();
    const newMax = !max || currentValue > maxValue ? date : max;
    const newMin = !min || currentValue < minValue ? date : min;

    return [newMax, new Date(newMin.getTime() + ONE_DAY_MILISECONDS)];
  }

  private manageStationsList(
    stationsListed: Set<string>,
    item: DammingsInfoResponse,
    stations: StationItem[]
  ): string {
    let stationKey = '';

    if (!stationsListed.has(item.estaci)) {
      stationKey = uuidv4();
      stations.push({
        key: stationKey,
        name: item.estaci,
      });
      stationsListed.add(item.estaci);
    } else {
      const stationValue = stations.find(
        (itemStation: StationItem) => itemStation.name === item.estaci
      );
      if (stationValue) {
        stationKey = stationValue.key;
      }
    }

    return stationKey;
  }
}
