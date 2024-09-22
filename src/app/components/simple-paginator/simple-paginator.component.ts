import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatFormField,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';

@Component({
  selector: 'app-simple-paginator',
  templateUrl: './simple-paginator.component.html',
  styleUrl: './simple-paginator.component.scss',
  standalone: true,
  imports: [MatSelectModule, NgFor, MatFormField, MatButtonModule, NgIf],
})
export class SimplePaginatorComponent {
  @Input() pageSizeOptions = [5, 10, 15, 25, 50, 100];
  @Input() pageSize = 5;
  @Input() disablePrevious = false;
  @Input() disableNext = false;
  @Input() currentPage = 1;
  @Input() firstPage = 1;
  @Input() lastPage = 1;
  @Input() showFirstLastPage = false;

  @Output() goPage: EventEmitter<number> = new EventEmitter<number>();
  @Output() changePageSize: EventEmitter<number> = new EventEmitter<number>();

  handleChangePageSize(data: MatSelectChange): void {
    this.changePageSize.emit(data.value);
  }
}
