import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private data: Map<string, HttpResponse<unknown>> = new Map<
    string,
    HttpResponse<unknown>
  >();

  setCache(key: string, data: HttpResponse<unknown>): void {
    this.data.set(key, data);
  }

  getCache(key: string): HttpResponse<unknown> | undefined {
    return this.data.get(key);
  }

  deleteCache(key: string): void {
    this.data.delete(key);
  }
}
