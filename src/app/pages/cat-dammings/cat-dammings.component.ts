import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
  Signal,
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
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import {
  FilterForm,
  StationItem,
} from '../../models/cat-dammings/cat-dammings.model';
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
    PageTitleComponent,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
})
export class CatDammingsComponent implements OnInit {
  dammingsService!: CatDammingsService;
  private readonly injector = inject(Injector);

  maxDate!: Signal<Date | undefined>;
  minDate!: Signal<Date | undefined>;
  stations!: Signal<StationItem[] | undefined>;

  form!: FormGroup<FilterForm>;

  selectedStations: string[] = [];

  constructor() {
    this.dammingsService = inject(CatDammingsService);
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
  }

  search(): void {
    console.log(this.form.getRawValue());
  }

  changeStation(event: MatCheckboxChange, station: StationItem): void {
    if (event.checked) {
      this.selectedStations.push(station.key);
    } else {
      this.selectedStations = this.selectedStations.filter(
        (item) => item !== station.key
      );
    }

    this.form.controls.stations.setValue(
      this.selectedStations.length ? this.selectedStations : undefined
    );
  }
}
