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

export function cacheInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const MAX_SECONDS_CACHE = 10;
  const cacheService = inject(CacheService);
  const getSeconds = () => Math.trunc(new Date().getTime() / 1000);
  const cached = cacheService.getCache(req.urlWithParams);

  if (req.method !== 'GET' || req.context.get(NO_CACHE)) {
    return next(req);
  }

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
