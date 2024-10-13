import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { SpotifyAPIService } from '../services/spotify-api.service';
import { SPOTIFY_REQUEST } from '../utils/http-context.util';

export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
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
