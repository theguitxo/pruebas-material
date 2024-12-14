import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';
import { NO_CACHE } from '../utils/http-context.util';

/**
 * Interceptor para cachear peticiones HTTP
 * @param {HttpRequest} req Petición http a la que se aplica el interceptor
 * @param {HttpHandlerFn} next Siguiente interceptor a ejecutar o respuesta del backend (cuando no hay más interceptores)
 * @returns {Observable<HttpEvent>} Un evento http
 */
export function cacheInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  /**
   * Caducidad para la caché
   */
  const MAX_SECONDS_CACHE = 10;
  /**
   * Servicio que maneja los datos de la caché
   */
  const cacheService = inject(CacheService);
  /**
   * Devuelve los segundos del tiempo actual
   * @returns {number} El número de segundos
   */
  const getSeconds = () => Math.trunc(new Date().getTime() / 1000);
  /**
   * Indicador si la llamada esta ya cacheada
   */
  const cached = cacheService.getCache(req.urlWithParams);

  if (req.method !== 'GET' || req.context.get(NO_CACHE)) {
    return next(req);
  }

  /**
   * Indicador si ha de usar la caché
   * @param {number} time Segundos del tiempo en que se hizo la petición cacheada
   * @returns {boolean} Indicador si se ha de usar o no la caché
   */
  const useCache = (time: number) => {
    const currentTime = getSeconds();
    return (
      !MAX_SECONDS_CACHE ||
      (MAX_SECONDS_CACHE && currentTime - time < MAX_SECONDS_CACHE)
    );
  };

  if (cached) {
    if (useCache(cached.time)) {
      return of(cached.req);
    } else {
      cacheService.deleteCache(req.urlWithParams);
    }
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cacheService.setCache(req.urlWithParams, {
          req: event,
          time: getSeconds(),
        });
      }
    })
  );
}
