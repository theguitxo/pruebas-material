import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  itemsPerPageLabel = 'Items por página';
  firstPageLabel = 'Primera página';
  lastPageLabel = 'Última página';
  nextPageLabel = 'Siguiente página';
  previousPageLabel = 'Página anterior';
  changes: Subject<void> = new Subject<void>();

  getRangeLabel(page: number, pageSize: number, length: number) {
    if (length === 0) {
      return 'Página 1 de 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  }
}
