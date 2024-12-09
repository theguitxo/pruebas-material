import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseCharacterList } from '../models/disney-api/disney-api.model';

/**
 * Servicio para el manejo de la API de Disney
 */
@Injectable({
  providedIn: 'root',
})
export class DisneyAPIService {
  /**
   * Servicio de Angular para llamadas http
   */
  private readonly httpClient!: HttpClient;

  /**
   * URL de los servicios de Disney
   */
  private readonly baseURL = 'https://api.disneyapi.dev';

  /**
   * Tamaño para la página de resultados
   */
  pageSize = 5;

  /**
   * Página actual a mostrar
   */
  currentPage = 1;

  /**
   * Subject para obtener la lista de personajes recibida del servicio
   */
  private readonly _charactersList: BehaviorSubject<
    ResponseCharacterList | undefined
  > = new BehaviorSubject<ResponseCharacterList | undefined>(undefined);

  /**
   * Devuelve la lista de personajes obtenida del servicio como un observable
   */
  get charactersList(): Observable<ResponseCharacterList | undefined> {
    return this._charactersList.asObservable();
  }

  /**
   * Método constructor
   */
  constructor() {
    this.httpClient = inject(HttpClient);
  }

  /**
   * Carga toda la lista de personajes de Disney
   */
  getAllCharacters(): void {
    const params = this.setCommonParams();

    this.getHttpRequest(params);
  }

  /**
   * Obtiene una lista de personajes filtrada por nombre
   * @param {string} name Nombre del personaje por el que filtrar
   */
  filterCharacters(name: string): void {
    const params = this.setCommonParams().append('name', name);

    this.getHttpRequest(params);
  }

  /**
   * Establece los parámetros comunes para todas las llamadas a la API
   * @returns {HttpParams} Un objeto HttpParams con los parámetros añadidos
   */
  setCommonParams(): HttpParams {
    return new HttpParams()
      .append('pageSize', this.pageSize)
      .append('page', this.currentPage);
  }

  /**
   * Realiza una llamada a la petición de personajes de la API de Disney
   * @param {HttpParams} params Objeto HttpParams para la llamada a la API
   */
  getHttpRequest(params: HttpParams): void {
    this.httpClient
      .get<ResponseCharacterList>(`${this.baseURL}/character`, {
        params,
      })
      .subscribe((data) => this._charactersList.next(data));
  }
}
