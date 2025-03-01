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

/**
 * Componente para mostrar información de embalses de Cataluña
 */
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
  /**
   * Servicio para manejar los datos de la API de la Generalitat
   */
  private readonly dammingsService!: CatDammingsService;
  /**
   * Servicio para motrar mensajes emergentes
   */
  private readonly snackBar!: MatSnackBar;
  /**
   * Servicio para manejar modales
   */
  private readonly dialog!: MatDialog;
  /**
   * Servicio para inyectar otros servicios
   */
  private readonly injector = inject(Injector);
  /**
   * Servicio para lanzar eventos cuando se destruye el componente
   */
  private readonly destroyRef = inject(DestroyRef);
  /**
   * Servicio de Angular para monitorizar los cambios entre diferentes resoluciones de dispositivos
   */
  breakpointService!: BreakpointService;

  /**
   * Referencia al  MatSort de Angular Material usado en el componente
   */
  @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
    if (this.filteredStations) {
      this.filteredStations.sort = sort;
    }
  }

  /**
   * Fecha máxima de la que hay datos
   */
  maxDate!: Signal<Date | undefined>;
  /**
   * Fecha mínima de la que hay datos
   */
  minDate!: Signal<Date | undefined>;
  /**
   * Lista de embalses para mostrar en los selectores
   */
  stations!: Signal<StationItem[] | undefined>;
  /**
   * Lista con información de los embalses
   */
  list!: Signal<DammingsInfoItem[] | undefined>;
  /**
   * Indicador si se han seleccionado todos los embalses (en selectores o checkboxs)
   */
  allSelected = false;
  /**
   * Total de embalses seleccionados
   */
  amountSelected = 0;
  /**
   * Formulario para filtrar los datos
   */
  form!: FormGroup<FilterForm>;
  /**
   * Embalses seleccionados (para controlar los checkboxes)
   */
  checkedStations: Set<string> = new Set<string>();
  /**
   * Lista con información de embalses filtrada según los seleccionados
   */
  filteredStations!: MatTableDataSource<FilteredInfoItem>;
  /**
   * Columnas a mostrar en el listado de embalses filtrados
   */
  stationsDisplayedColumns: string[] = [
    'estaci',
    'nivell_absolut',
    'percentatge_volum_embassat',
    'volum_embassat',
    'actions',
  ];
  /**
   * Información a mostrar en el modal al pusar el botón de más información
   */
  moreInfoData: FilteredInfoItemDate[] = [];

  /**
   * Método constructor
   */
  constructor() {
    this.dammingsService = inject(CatDammingsService);
    this.snackBar = inject(MatSnackBar);
    this.dialog = inject(MatDialog);
    this.breakpointService = inject(BreakpointService);
  }

  /**
   * Inicia el formulario y los signals, y carga la información de los embalses
   */
  ngOnInit(): void {
    this._initForm();
    this._initSignals();
    this.dammingsService.loadData();
  }

  /**
   * Inicia el formulario para el filtrado de datos
   */
  private _initForm(): void {
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

  /**
   * Inicia los signals
   */
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

  /**
   * Método a llamar cuando se cambia uno de los checkboxes para escoger un embalse en el filtro (en modo escritorio)
   * @param {MatCheckboxChange} event Información del evento de cambio de un checkbox
   * @param {StatioItem} station Información del embalse que ha cambiado el checkbox
   */
  changeStation(event: MatCheckboxChange, station: StationItem): void {
    this.form.controls.stations.setValue(
      event.checked
        ? [...(this.form.controls.stations.value ?? []), station.key]
        : this.form.controls.stations.value?.filter((i) => i !== station.key)
    );

    this._setCheckedStations();
  }

  /**
   * Método a llamar cuando se selecciona una opción de la lista desplegable (en modo móvil)
   * @param {boolean} all Indicador si se ha elegido la opción 'TODOS'
   */
  optionSelectClick(all: boolean): void {
    all ? this._optionSelectAll() : this._optionSelectValue();

    this._setCheckedStations();
  }

  /**
   * Método para que se seleccionen en la lista desplegable las opciones seleccionadas
   * @param {string} option Valor de la lista a comprobar
   * @param {string} selected Valor de la lista de seleccionados
   * @returns {boolean} Verdadero o falso si la opción se encuentra entre las seleccionadas
   */
  compareFn(option: string, selected: string): boolean {
    return option === selected;
  }

  /**
   * Selecciona todos los embalses (checkboxes en modo escritorio)
   */
  selectAll(): void {
    this.form.controls.stations.setValue([
      TODOS,
      ...(this.stations()?.map((i) => i.key) ?? []),
    ]);
    this.allSelected = true;
    this._setCheckedStations();
  }

  /**
   * Deselecciona todos los embalses (checkboxes en modo escritorio)
   */
  unselectAll(): void {
    this.form.controls.stations.reset();
    this.allSelected = false;
    this._setCheckedStations();
  }

  /**
   * Acciones a relizar cuando se selecciona la opción 'TODOS' de la lista desplegable
   */
  private _optionSelectAll(): void {
    this.allSelected = !!this._getSelectedStations().length;

    this.form.controls.stations.setValue(
      this.allSelected
        ? [TODOS, ...(this.stations()?.map((i) => i.key) ?? [])]
        : []
    );
  }

  /**
   * Acciones a realizar cuando se selecciona alguna opción de la lista que no sea 'TODOS'
   */
  private _optionSelectValue(): void {
    const stationsSelected = this._getSelectedStations();

    this.allSelected = stationsSelected?.length === this.stations()?.length;

    this.form.controls.stations.setValue(
      this.allSelected ? [TODOS, ...(stationsSelected ?? [])] : stationsSelected
    );
  }

  /**
   * Setea uan lista de valores únicos con los embalses seleccionados
   */
  private _setCheckedStations(): void {
    this.checkedStations = new Set(this._getSelectedStations());
  }

  /**
   * Obtiene la lista de embalses seleccionados
   * @returns {string[]} Lista de embalses seleccionados
   */
  private _getSelectedStations(): string[] {
    return this.form.controls.stations.value?.filter((i) => i !== TODOS) ?? [];
  }

  /**
   * Establece la información para la tabla de Angular Material con la lista de embalses filtrados
   */
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

  /**
   * Método para aplicar al filtro de embalses
   * @param {DammingsInfoItem} station Información del embalse seleccionado
   * @param {string[]} stations LIsta con los identificadores de los emblases
   * @param {Date} date Fecha por la que se ha de filtrar
   * @returns {boolean} Indicador si cumple las condiciones y pasa el fitro
   */
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

  /**
   * Prepara un objeto con la información de un embalse para mostrar en listados, modal, ...
   * @param {DammingsInfoItem} station Información del embalse a mostrar su información
   * @returns {FilteredInfoItem} Información el emblase
   */
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

  /**
   * Abre un modal con más información de un embalse
   * @param {stationId} stationId Identificador del embalse a cargar su información
   */
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

  /**
   * Obtiene la información del un emblase en un fecha concreta, para mostrar en el modal de más información
   * @param {string} stationId Identificador del embalse a obtener su información
   * @param {Date} date Fecha de la que se ha de obtener la información del embalse
   * @returns {FilteredInfoItemDate} Lista con un único registro con la información del embalse según fecha
   */
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

  /**
   * Crea la lista de fechas de las que se ha mostrar información en el modal de 'ver más'
   * @returns {Date[]} Una lista de objetos de fecha
   */
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
