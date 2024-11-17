import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalWrapperComponent } from '../../../../components/modal-wrapper/modal-wrapper.component';
import { FilteredInfoItemDate } from '../../../../models/cat-dammings/cat-dammings.model';

@Component({
  selector: 'app-dammings-historic-chart',
  templateUrl: './historic-chart.component.html',
  styleUrl: './historic-chart.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalWrapperComponent, JsonPipe],
})
export class CatDammingsHistoricChartComponent implements OnInit {
  data: FilteredInfoItemDate[] = inject(MAT_DIALOG_DATA);

  title!: Signal<string>;
  ngOnInit(): void {
    this.title = signal(this.data[0].estaci);
  }
}
