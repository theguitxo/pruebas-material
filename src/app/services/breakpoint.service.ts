import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

/**
 * Servicio para comprobar los breakpoints de diferentes dispositivos y resoluciones
 */
@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  /**
   * Servicio de Angular para observar breakpoints
   */
  private readonly breakpointObserver!: BreakpointObserver;

  /**
   * Método constructor
   */
  constructor() {
    this.breakpointObserver = inject(BreakpointObserver);
  }

  /**
   * Devuelve si el breakpoint corresponde a un móvil en vertical
   * @returns {boolean} True si el dispositivo es un móvil en vertical
   */
  isHandsetPortrait(): Observable<boolean> {
    return this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .pipe(map((result) => result.matches));
  }
}
