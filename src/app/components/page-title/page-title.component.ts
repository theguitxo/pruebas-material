import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TITLES } from '../../constants/routes.constants';

/**
 * Componente para mostrar un texto a modo de titulo
 */
@Component({
  selector: 'app-page-title',
  template: ` <h3>{{ title() }}</h3>`,
  styles: [
    `
      h3 {
        font-size: 1.5rem;
        font-weight: normal;
      }
    `,
  ],
})
export class PageTitleComponent implements OnInit {
  /**
   * Servicio de Angular para obtener información de la ruta activa
   */
  private readonly activatedRoute!: ActivatedRoute;

  /**
   * Texto a mostrar como titulo
   */
  title!: WritableSignal<string | undefined>;

  /**
   * Método constructor
   */
  constructor() {
    this.activatedRoute = inject(ActivatedRoute);
  }

  /**
   * Inicio del componente
   */
  ngOnInit(): void {
    this._initTitle();
  }

  /**
   * Establece el valor para titulo según la ruta cargada
   */
  private _initTitle(): void {
    const path = this.activatedRoute.snapshot.routeConfig?.path;
    if (path) {
      const value = Object.entries(TITLES).find(
        (item: string[]) => item[0] === path
      );
      if (value) {
        this.title = signal(value[1]);
      }
    }
  }
}
