import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

/**
 * Servic io para la traducción del componente de paginación de Angular Material
 */
@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  /**
   * Texto para items por página
   */
  itemsPerPageLabel = 'Items por página';
  /**
   * Texto para el tooltip de primera página
   */
  firstPageLabel = 'Primera página';
  /**
   * Texto para el tooltip de última página
   */
  lastPageLabel = 'Última página';
  /**
   * Texto para el tooltip de siguiente página
   */
  nextPageLabel = 'Siguiente página';
  /**
   * Texto para el tooltip de página anterior
   */
  previousPageLabel = 'Página anterior';
  /**
   * Subject que emite cuando cambian las etiquetas (p.e.: al cambiar de idioma) No usado
   */
  changes: Subject<void> = new Subject<void>();

  /**
   * Devuelve el texto usado por el paginador para mostrar el rango de página
   * @param {number} page Número de página que se esta mostrando
   * @param {number} pageSize Tamaño de la página
   * @param {number} length Total de items del listado
   * @returns {string} Texto a mostrar en el paginador
   */
  getRangeLabel(page: number, pageSize: number, length: number) {
    if (length === 0) {
      return 'Página 1 de 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  }
}
