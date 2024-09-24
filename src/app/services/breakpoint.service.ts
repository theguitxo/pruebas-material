import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private readonly breakpointObserver!: BreakpointObserver;

  constructor() {
    this.breakpointObserver = inject(BreakpointObserver);
  }

  isHandsetPortrait(): Observable<boolean> {
    return this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .pipe(map((result) => result.matches));
  }
}
