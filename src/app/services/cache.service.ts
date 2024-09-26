import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private readonly data: Map<
    string,
    { req: HttpResponse<unknown>; time: number }
  > = new Map<string, { req: HttpResponse<unknown>; time: number }>();

  setCache(
    key: string,
    data: { req: HttpResponse<unknown>; time: number }
  ): void {
    this.data.set(key, data);
  }

  getCache(
    key: string
  ): { req: HttpResponse<unknown>; time: number } | undefined {
    return this.data.get(key);
  }

  deleteCache(key: string): void {
    this.data.delete(key);
  }
}
