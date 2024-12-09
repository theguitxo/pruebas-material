import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ONE_DAY_MILISECONDS } from '../constants/common.constants';
import {
  DammingsInfo,
  DammingsInfoItem,
  DammingsInfoResponse,
  StationItem,
} from '../models/cat-dammings/cat-dammings.model';

/**
 * Servicio para consultar datos de los embalses de Cataluña
 */
@Injectable({
  providedIn: 'any',
})
export class CatDammingsService {
  /**
   * URL a los datos
   */
  private readonly URL =
    'https://analisi.transparenciacatalunya.cat/resource/gn9e-3qhr.json';

  /**
   * Servicio de Angular para realizar llamadas HTTP
   */
  private readonly http!: HttpClient;

  /**
   * Subject para emitir la fecha máxima para mostrar datos
   */
  private readonly _maxDate: BehaviorSubject<Date | undefined> =
    new BehaviorSubject<Date | undefined>(undefined);
  /**
   * Subject para emitir la fecha mínima para mostrar datos
   */
  private readonly _minDate: BehaviorSubject<Date | undefined> =
    new BehaviorSubject<Date | undefined>(undefined);
  /**
   * Subject para emitir la lista de embalses
   */
  private readonly _stations: BehaviorSubject<StationItem[] | undefined> =
    new BehaviorSubject<StationItem[] | undefined>(undefined);
  /**
   * Subject para emitir la lista con los datos de los embalses
   */
  private readonly _list: BehaviorSubject<DammingsInfoItem[] | undefined> =
    new BehaviorSubject<DammingsInfoItem[] | undefined>(undefined);

  /**
   * Observable para obtener la fecha máxima de datos
   */
  get maxDate(): Observable<Date | undefined> {
    return this._maxDate.asObservable();
  }
  /**
   * Observable para obtener la fecha mínima de datos
   */
  get minDate(): Observable<Date | undefined> {
    return this._minDate.asObservable();
  }
  /**
   * Observable para obtener la lista de emblases
   */
  get stations(): Observable<StationItem[] | undefined> {
    return this._stations.asObservable();
  }
  /**
   * Observable para obtener la lista con los datos de los embalses
   */
  get list(): Observable<DammingsInfoItem[] | undefined> {
    return this._list.asObservable();
  }

  /**
   * Método constructor
   */
  constructor() {
    this.http = inject(HttpClient);
  }

  /**
   * Carga los datos desde el servicio de la Generalitat
   */
  loadData(): void {
    this.http
      .get<DammingsInfoResponse[]>(this.URL)
      .pipe(
        take(1),
        tap((result: DammingsInfoResponse[]) => this.setStationsInfo(result))
      )
      .subscribe();
  }

  /**
   * Obtiene los valores para las fechas, embalses y lista de datos y los emite
   * @param {DammingsInfoItem} data Datos de embalses obtenidos de la llamada al servicio
   */
  private setStationsInfo(data: DammingsInfoResponse[]): void {
    const { maxDate, minDate, stations, list } = this.setInfo(data);

    this._maxDate.next(maxDate);
    this._minDate.next(minDate);
    this._stations.next(stations);
    this._list.next(list);
  }

  /**
   * Establece los valores para las fechas máxima y mínima, los embalses y la lista de datos que serán emitidos
   * @param {DammingsInfoResponse[]} data Lista con los datos recibidos del servicio de la Generalitat
   * @returns {DammingsInfo} Objeto con los datos a emitir
   */
  private setInfo(data: DammingsInfoResponse[]): DammingsInfo {
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

  /**
   * Recibe una fecha, un máximo y un mínimo y devuelve los nuevos valores para fecha máxima y mínima
   * @param {Date} date Fecha a comprobar
   * @param {Date} max Fecha máxima actual
   * @param {Date} min Fecha mínima actual
   * @returns {Date[]} Array con dos elementos: la fecha máxima y la mínima
   */
  private setMaxMinDate(date: Date, max: Date, min: Date): [Date, Date] {
    const currentValue = date.getTime();
    const maxValue = max?.getTime();
    const minValue = min?.getTime();
    const newMax = !max || currentValue > maxValue ? date : max;
    const newMin = !min || currentValue < minValue ? date : min;

    return [newMax, new Date(newMin.getTime() + ONE_DAY_MILISECONDS)];
  }

  /**
   * Gestiona la lista de embalses al ir generando la lista con los datos
   * @param {Set<string>} stationsListed Lista de identificadores de embalses ya gestionados
   * @param {DammingsInfoItem} item Registro de la lista obtenido del servicio que se esta gestionando
   * @param {StationItem[]} stations Lista de objetos con identificadores y nombres de los embalses gestionadas (para el selector)
   * @returns {string} Identificador del embalse gestionado
   */
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
