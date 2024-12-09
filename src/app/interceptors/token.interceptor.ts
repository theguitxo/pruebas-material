import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { SpotifyAPIService } from '../services/spotify-api.service';
import { SPOTIFY_REQUEST } from '../utils/http-context.util';

/**
 * Interceptor para insertar un token en las llamadas a la API de Spotify
 * @param {HttpRequest} req Petición http a la que se aplica el interceptor
 * @param {HttpHandlerFn} next Siguiente interceptor a ejecutar o respuesta del backend (cuando no hay más interceptores)
 * @returns {Observable<HttpEvent>} Un evento http
 */
export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  /**
   * Servicio para el manejor de peticiones http a la API de Spotify
   */
  const spotifyService = inject(SpotifyAPIService);

  if (!req.context.get(SPOTIFY_REQUEST)) {
    return next(req);
  }

  return spotifyService.getToken().pipe(
    switchMap((token) => {
      const wihtHeaders = req.clone({
        setHeaders: {
          Authorization: token,
        },
      });

      return next(wihtHeaders);
    })
  );
}
