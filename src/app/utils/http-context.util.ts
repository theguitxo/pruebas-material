import { HttpContext, HttpContextToken } from '@angular/common/http';

export const NO_CACHE = new HttpContextToken<boolean>(() => false);
export const SPOTIFY_REQUEST = new HttpContextToken<boolean>(() => false);

export function noCache() {
  return new HttpContext().set(NO_CACHE, true);
}

export function spotifyRequest() {
  return new HttpContext().set(SPOTIFY_REQUEST, true);
}
