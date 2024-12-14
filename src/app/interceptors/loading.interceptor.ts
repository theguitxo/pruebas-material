import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Interceptor para mostrar el loading spinner mientras se hacen llamadas a back-end
 * @param {HttpRequest} req Petición http a la que se aplica el interceptor
 * @param {HttpHandlerFn} next Siguiente interceptor a ejecutar o respuesta del backend (cuando no hay más interceptores)
 * @returns {Observable<HttpEvent>} Un evento http
 */
export function loadingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  /**
   * Servicio para mostrar y ocultar el loading spinner
   */
  const loadingService = inject(LoadingService);

  loadingService.startLoading();

  return next(req).pipe(finalize(() => loadingService.stopLoading()));
}
