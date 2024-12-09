import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatFormField,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';
import { BreakpointService } from '../../services/breakpoint.service';

/**
 * Componente para paginar resultados
 */
@Component({
  selector: 'app-simple-paginator',
  templateUrl: './simple-paginator.component.html',
  styleUrl: './simple-paginator.component.scss',
  imports: [AsyncPipe, MatSelectModule, MatFormField, MatButtonModule],
})
export class SimplePaginatorComponent {
  /**
   * Opciones para el tamaño de la página
   */
  @Input() pageSizeOptions = [5, 10, 15, 25, 50, 100];
  /**
   * Tamaño de la página
   */
  @Input() pageSize = 5;
  /**
   * Si ha de deshabilitar el botón de página anterior
   */
  @Input() disablePrevious = false;
  /**
   * Si ha de deshabilitar el botón de página siguiente
   */
  @Input() disableNext = false;
  /**
   * Página actual del listado
   */
  @Input() currentPage = 1;
  /**
   * Primera página del listado
   */
  @Input() firstPage = 1;
  /**
   * Última página del listado
   */
  @Input() lastPage = 1;
  /**
   * Si ha de mostrar los botones para ir a la primera y última página
   */
  @Input() showFirstLastPage = false;

  /**
   * Evento al cambiar de página
   */
  @Output() goPage: EventEmitter<number> = new EventEmitter<number>();
  /**
   * Evento al cambiar el tamaño de la página
   */
  @Output() changePageSize: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Servicio de Angular para monitorizar los cambios entre diferentes resoluciones de dispositivos
   */
  breakpointService!: BreakpointService;

  /**
   * Método a llamar cuando se cambia la opción de tamaño de página
   * @param {MatSelectChange} data Datos de la opción escogida
   */
  handleChangePageSize(data: MatSelectChange): void {
    this.changePageSize.emit(data.value);
  }

  /**
   * Método constructor
   */
  constructor() {
    this.breakpointService = inject(BreakpointService);
  }
}
