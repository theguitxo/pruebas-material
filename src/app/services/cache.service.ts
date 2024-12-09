import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Servicio para cachear la respuesta de una llamada http
 */
@Injectable({
  providedIn: 'root',
})
export class CacheService {
  /**
   * Mapa con las llamadas http y sus resultados
   */
  private readonly data: Map<
    string,
    { req: HttpResponse<unknown>; time: number }
  > = new Map<string, { req: HttpResponse<unknown>; time: number }>();

  /**
   * Guarda el resultado de una llamada
   * @param {string} key Url de la llamada http
   * @param { req: HttpResponse; time: number } data datos de la llamada http: el objeto de respuesta y el tiempo en que se ha realizado
   */
  setCache(
    key: string,
    data: { req: HttpResponse<unknown>; time: number }
  ): void {
    this.data.set(key, data);
  }

  /**
   * Devuelve los datos de una llamada guardada
   * @param {string} key Url de la llamada http
   * @returns { req: HttpResponse; time: number } Objeto con la información de la respuesta http y el tiempo en que realizó
   */
  getCache(
    key: string
  ): { req: HttpResponse<unknown>; time: number } | undefined {
    return this.data.get(key);
  }

  /**
   * Borra una entrada de la caché de llamadas
   * @param {string} key Url de la llamada http
   */
  deleteCache(key: string): void {
    this.data.delete(key);
  }
}
