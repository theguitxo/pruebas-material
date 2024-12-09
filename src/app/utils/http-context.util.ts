import { HttpContext, HttpContextToken } from '@angular/common/http';

export const NO_CACHE = new HttpContextToken<boolean>(() => false);
export const SPOTIFY_REQUEST = new HttpContextToken<boolean>(() => false);

/**
 * Devuelve un contexto para no usar la caché de la aplicación en las peticiones http
 * @returns {HttpContextToken} token de contexto para deshabilitar la caché de la aplicación en peticiones http
 */
export function noCache() {
  return new HttpContext().set(NO_CACHE, true);
}

/**
 * Devuelve un contexto para indicar que una petición http es de la API de Spotify
 * @returns {HttpContextToken} token para indicar que una petición es de la API de Spotify
 */
export function spotifyRequest() {
  return new HttpContext().set(SPOTIFY_REQUEST, true);
}
