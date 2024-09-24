import { HttpContext, HttpContextToken } from '@angular/common/http';

export const NO_CACHE = new HttpContextToken<boolean>(() => false);

export function noCache() {
  return new HttpContext().set(NO_CACHE, true);
}
