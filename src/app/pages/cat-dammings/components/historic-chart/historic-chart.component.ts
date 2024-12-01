import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ModalWrapperComponent } from '../../../../components/modal-wrapper/modal-wrapper.component';
import { FilteredInfoItemDate } from '../../../../models/cat-dammings/cat-dammings.model';

@Component({
    selector: 'app-dammings-historic-chart',
    templateUrl: './historic-chart.component.html',
    styleUrl: './historic-chart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalWrapperComponent, BaseChartDirective]
})
export class CatDammingsHistoricChartComponent implements OnInit {
  data: FilteredInfoItemDate[] = inject(MAT_DIALOG_DATA);

  title!: WritableSignal<string>;

  barChartLegend = false;

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['a', 'b', 'c'],
    datasets: [{ data: [65, 10, 25] }],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  ngOnInit(): void {
    this.title = signal(this.data[0].estaci);
  }
}
