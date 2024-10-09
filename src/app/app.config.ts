import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { cacheInterceptor } from './interceptors/cache.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { BreakpointService } from './services/breakpoint.service';
import { CacheService } from './services/cache.service';
import { DisneyAPIService } from './services/disney-api.service';
import { LoadingService } from './services/loading.service';
import { tokenInterceptor } from './interceptors/token.interceptor';

const interceptors: HttpInterceptorFn[] = [
  cacheInterceptor, loadingInterceptor, tokenInterceptor
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors(interceptors)),
    DisneyAPIService,
    CacheService,
    LoadingService,
    BreakpointService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
};
