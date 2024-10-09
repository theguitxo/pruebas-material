import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { map, Observable, switchMap } from "rxjs";
import { SPOTIFY_REQUEST } from "../utils/http-context.util";
import { SpotifyAPIService } from "../services/spotify-api.service";
import { inject } from "@angular/core";

export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const spotifyService = inject(SpotifyAPIService);

  if (!req.context.get(SPOTIFY_REQUEST)) {
    return next(req);
  }

  return spotifyService.getToken().pipe(switchMap((token) => {
    const wihtHeaders = req.clone({
      setHeaders:{
        Authorization: 'Bearer ' + token.access_token
      }});

    return next(wihtHeaders);
    }
  ))
}
