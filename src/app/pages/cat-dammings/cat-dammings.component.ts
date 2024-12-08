import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  OnInit,
  Signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { ONE_DAY_MILISECONDS } from '../../constants/common.constants';
import {
  DammingsInfoItem,
  FilteredInfoItem,
  FilteredInfoItemDate,
  FilterForm,
  StationItem,
} from '../../models/cat-dammings/cat-dammings.model';
import { BreakpointService } from '../../services/breakpoint.service';
import { CatDammingsService } from '../../services/cat-dammings.service';
import { CatDammingsHistoricChartComponent } from './components/historic-chart/historic-chart.component';

export const TODOS = 'todos';
@Component({
  selector: 'app-cat-dammings',
  templateUrl: './cat-dammings.component.html',
  styleUrl: './cat-dammings.component.scss',
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
    MatIconModule,
    MatTooltipModule,
  ],
})
export class CatDammingsComponent implements OnInit {
  private readonly dammingsService!: CatDammingsService;
  private readonly snackBar!: MatSnackBar;
  private readonly dialog!: MatDialog;
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

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
  allSelected = false;
  amountSelected = 0;
  form!: FormGroup<FilterForm>;
  checkedStations: Set<string> = new Set<string>();
  filteredStations!: MatTableDataSource<FilteredInfoItem>;
  stationsDisplayedColumns: string[] = [
    'estaci',
    'nivell_absolut',
    'percentatge_volum_embassat',
    'volum_embassat',
    'actions',
  ];
  moreInfoData: FilteredInfoItemDate[] = [];

  constructor() {
    this.dammingsService = inject(CatDammingsService);
    this.snackBar = inject(MatSnackBar);
    this.dialog = inject(MatDialog);
    this.breakpointService = inject(BreakpointService);
  }

  ngOnInit(): void {
    this._initForm();
    this._initSignals();
    this.dammingsService.loadData();
  }

  private _initForm() {
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

    this.form.controls.stations.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string[] | undefined) => {
        this.amountSelected = value?.length ?? 0;
      });
  }

  private _initSignals(): void {
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
    this.form.controls.stations.setValue(
      event.checked
        ? [...(this.form.controls.stations.value ?? []), station.key]
        : this.form.controls.stations.value?.filter((i) => i !== station.key)
    );

    this._setCheckedStations();
  }

  optionSelectClick(all: boolean): void {
    all ? this._optionSelectAll() : this._optionSelectValue();

    this._setCheckedStations();
  }

  compareFn(option: string, selected: string): boolean {
    return option === selected;
  }

  selectAll(): void {
    this.form.controls.stations.setValue([
      TODOS,
      ...(this.stations()?.map((i) => i.key) ?? []),
    ]);
    this.allSelected = true;
    this._setCheckedStations();
  }

  unselectAll(): void {
    this.form.controls.stations.reset();
    this.allSelected = false;
    this._setCheckedStations();
  }

  private _optionSelectAll(): void {
    this.allSelected = !!this._getSelectedStations().length;

    this.form.controls.stations.setValue(
      this.allSelected
        ? [TODOS, ...(this.stations()?.map((i) => i.key) ?? [])]
        : []
    );
  }

  private _optionSelectValue(): void {
    const stationsSelected = this._getSelectedStations();

    this.allSelected = stationsSelected?.length === this.stations()?.length;

    this.form.controls.stations.setValue(
      this.allSelected ? [TODOS, ...(stationsSelected ?? [])] : stationsSelected
    );
  }

  private _setCheckedStations(): void {
    this.checkedStations = new Set(this._getSelectedStations());
  }

  private _getSelectedStations(): string[] {
    return this.form.controls.stations.value?.filter((i) => i !== TODOS) ?? [];
  }

  filterData(): void {
    this.filteredStations = new MatTableDataSource(
      this.list()
        ?.filter((station: DammingsInfoItem) =>
          this._filterStationByDate(
            station,
            this.form.controls.stations.value ?? []
          )
        )
        ?.map((stationFiltered: DammingsInfoItem) =>
          this._mapStationInfo(stationFiltered)
        ) ?? []
    );
  }

  private _filterStationByDate(
    station: DammingsInfoItem,
    stations: string[],
    date?: Date
  ): boolean | undefined {
    const formDate = date ?? new Date(this.form.controls.date.value ?? '');
    return (
      station.date.getTime() === formDate.getTime() &&
      stations.includes(station.id_estaci)
    );
  }

  private _mapStationInfo(station: DammingsInfoItem): FilteredInfoItem {
    return {
      id_estaci: station.id_estaci,
      estaci: station.estaci,
      nivell_absolut: station.nivell_absolut,
      volum_embassat: station.volum_embassat,
      percentatge_volum_embassat:
        +station.percentatge_volum_embassat > 100
          ? `100`
          : station.percentatge_volum_embassat,
    };
  }

  viewMore(stationId: string): void {
    const dates = this._getDatesList();
    this.moreInfoData = [];

    if (dates.length) {
      dates.forEach((date: Date) => {
        this.moreInfoData = [
          ...this.moreInfoData,
          ...this._getMoreInfo(stationId, date),
        ];
      });
    }

    if (this.moreInfoData.length) {
      this.dialog.open(CatDammingsHistoricChartComponent, {
        data: this.moreInfoData,
        width: '80%',
      });
    } else {
      this.snackBar.open('No hay datos para mostrar', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  private _getMoreInfo(stationId: string, date: Date): FilteredInfoItemDate[] {
    return (
      this.list()
        ?.filter((station: DammingsInfoItem) =>
          this._filterStationByDate(station, [stationId], date)
        )
        ?.map((stationFiltered: DammingsInfoItem) => ({
          ...this._mapStationInfo(stationFiltered),
          dia: date,
        })) ?? []
    );
  }

  private _getDatesList(): Date[] {
    if (this.form.controls.date.value) {
      const minDate = this.minDate()?.getTime();
      let selectedDate = this.form.controls.date.value.getTime();
      let endDate = selectedDate - ONE_DAY_MILISECONDS * 7;

      if (minDate && endDate < minDate) {
        selectedDate = minDate + ONE_DAY_MILISECONDS * 7;
      }

      let dates = Array<Date>(7)
        .fill(new Date())
        .map((_v: Date, i: number) => {
          return new Date(selectedDate - ONE_DAY_MILISECONDS * i);
        });

      return dates;
    }

    return [];
  }
}
