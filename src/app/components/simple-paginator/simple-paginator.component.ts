import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatFormField,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';
import { BreakpointService } from '../../services/breakpoint.service';

@Component({
  selector: 'app-simple-paginator',
  templateUrl: './simple-paginator.component.html',
  styleUrl: './simple-paginator.component.scss',
  standalone: true,
  imports: [AsyncPipe, MatSelectModule, MatFormField, MatButtonModule],
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

  breakpointService!: BreakpointService;

  handleChangePageSize(data: MatSelectChange): void {
    this.changePageSize.emit(data.value);
  }

  constructor() {
    this.breakpointService = inject(BreakpointService);
  }
}
