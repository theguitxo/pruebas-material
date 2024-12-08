import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ModalWrapperComponent } from '../../../../components/modal-wrapper/modal-wrapper.component';
import { FilteredInfoItemDate } from '../../../../models/cat-dammings/cat-dammings.model';

@Component({
  selector: 'app-dammings-historic-chart',
  templateUrl: './historic-chart.component.html',
  styleUrl: './historic-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalWrapperComponent, BaseChartDirective],
})
export class CatDammingsHistoricChartComponent implements OnInit {
  data: FilteredInfoItemDate[] = inject(MAT_DIALOG_DATA);

  title!: WritableSignal<string>;

  barChartData!: ChartData<'bar'>;
  barChartOptions!: ChartOptions<'bar'>;

  ngOnInit(): void {
    this.title = signal(this.data[0].estaci);

    this.barChartData = {
      yLabels: [15, 20, 25, 30],
      labels: this.data.map((i) => i.dia.toLocaleDateString()).reverse(),
      datasets: [
        {
          data: this.data
            .map((i) => parseFloat(i.percentatge_volum_embassat))
            .reverse(),
          label: '% Volumen embalsado',
          backgroundColor: '#005cbb',
          animation: {},
          barPercentage: 0.5,
          borderRadius: 8,
          borderWidth: 0.5,
        },
      ],
    };

    this.barChartOptions = {
      responsive: true,
    };
  }
}
