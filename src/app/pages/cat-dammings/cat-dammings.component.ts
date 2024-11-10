import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
  Signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import {
  DammingsInfoItem,
  FilteredInfoItem,
  FilterForm,
  StationItem,
} from '../../models/cat-dammings/cat-dammings.model';
import { BreakpointService } from '../../services/breakpoint.service';
import { CatDammingsService } from '../../services/cat-dammings.service';

@Component({
  selector: 'app-cat-dammings',
  templateUrl: './cat-dammings.component.html',
  styleUrl: './cat-dammings.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES',
    },
    provideNativeDateAdapter(),
  ],
  imports: [
    DecimalPipe,
    AsyncPipe,
    PageTitleComponent,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatSort,
  ],
})
export class CatDammingsComponent implements OnInit {
  private readonly dammingsService!: CatDammingsService;
  private readonly injector = inject(Injector);
  breakpointService!: BreakpointService;

  @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
    if (this.filteredStations) {
      this.filteredStations.sort = sort;
    }
  }

  maxDate!: Signal<Date | undefined>;
  minDate!: Signal<Date | undefined>;
  stations!: Signal<StationItem[] | undefined>;
  list!: Signal<DammingsInfoItem[] | undefined>;

  form!: FormGroup<FilterForm>;

  selectedStations: string[] = [];

  filteredStations!: MatTableDataSource<FilteredInfoItem>;

  stationsDisplayedColumns: string[] = [
    'estaci',
    'nivell_absolut',
    'percentatge_volum_embassat',
    'volum_embassat',
  ];

  constructor() {
    this.dammingsService = inject(CatDammingsService);
    this.breakpointService = inject(BreakpointService);
  }

  ngOnInit(): void {
    this.initForm();
    this.initSignals();
    this.dammingsService.loadData();
  }

  private initForm() {
    this.form = new FormGroup<FilterForm>({
      date: new FormControl(undefined, {
        nonNullable: true,
        validators: Validators.required,
      }),
      stations: new FormControl(undefined, {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  private initSignals(): void {
    this.maxDate = toSignal(this.dammingsService.maxDate, {
      requireSync: true,
      injector: this.injector,
    });

    this.minDate = toSignal(this.dammingsService.minDate, {
      requireSync: true,
      injector: this.injector,
    });

    this.stations = toSignal(this.dammingsService.stations, {
      requireSync: true,
      injector: this.injector,
    });

    this.list = toSignal(this.dammingsService.list, {
      requireSync: true,
      injector: this.injector,
    });
  }

  changeStation(event: MatCheckboxChange, station: StationItem): void {
    if (event.checked) {
      this.selectedStations.push(station.key);
    } else {
      this.selectedStations = this.selectedStations.filter(
        (item) => item !== station.key
      );
    }

    this.setFormStationsValue();
  }

  selectChangeStation(event: MatSelectChange): void {
    this.selectedStations = event.value?.map((item: StationItem) => item.key);

    this.setFormStationsValue();
  }

  setFormStationsValue(): void {
    this.form.controls.stations.setValue(
      this.selectedStations.length ? this.selectedStations : undefined
    );
  }

  filterData(): void {
    this.filteredStations = new MatTableDataSource(
      this.list()
        ?.filter((station: DammingsInfoItem) => {
          const formDate = new Date(this.form.controls.date.value ?? '');
          return (
            station.date.getTime() === formDate.getTime() &&
            this.form.controls.stations.value?.includes(station.id_estaci)
          );
        })
        ?.map((stationFiltered: DammingsInfoItem) => ({
          estaci: stationFiltered.estaci,
          nivell_absolut: stationFiltered.nivell_absolut,
          percentatge_volum_embassat:
            +stationFiltered.percentatge_volum_embassat > 100
              ? `100`
              : stationFiltered.percentatge_volum_embassat,
          volum_embassat: stationFiltered.volum_embassat,
        })) || []
    );
  }
}
