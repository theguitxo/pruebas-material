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
  const cacheService = inject(CacheService);

  if (req.method !== 'GET' || req.context.get(NO_CACHE)) {
    return next(req);
  }

  const cached = cacheService.getCache(req.urlWithParams);

  if (cached) {
    return of(cached);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cacheService.setCache(req.urlWithParams, event);
      }
    })
  );
}
