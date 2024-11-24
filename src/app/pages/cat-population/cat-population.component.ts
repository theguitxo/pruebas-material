import { CdkStepper } from '@angular/cdk/stepper';
import { AsyncPipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  OnInit,
  signal,
  Signal,
  ViewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { filter, switchMap } from 'rxjs';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import {
  FILTER_PROVINCE_OPTIONS,
  ZIP_CODES,
} from '../../constants/cat-population/zip-codes.constants';
import { PopulationDataResponse } from '../../models/cat-population/population-response.model';
import { ZipCodeListItem } from '../../models/cat-population/zip-codes.model';
import { JoinPostalCodesPipe } from '../../pipes/join-postal-codes.pipe';
import { BreakpointService } from '../../services/breakpoint.service';
import { CatPopulationService } from '../../services/cat-population.service';

@Component({
  selector: 'app-cat-population',
  templateUrl: './cat-population.component.html',
  styleUrl: './cat-population.component.scss',
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    PageTitleComponent,
    DecimalPipe,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTabsModule,
    JoinPostalCodesPipe,
    MatGridListModule,
  ],
  providers: [JoinPostalCodesPipe, CdkStepper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatPopulationComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  private readonly catPopulationService!: CatPopulationService;
  private readonly injector = inject(Injector);
  private readonly formBuilder!: FormBuilder;
  private readonly destroyRef!: DestroyRef;
  private readonly joinPostalCodesPipe!: JoinPostalCodesPipe;

  breakpointService!: BreakpointService;

  zipCodes!: Signal<ZipCodeListItem[] | undefined>;
  populationData!: Signal<PopulationDataResponse[] | undefined>;

  provinceForm!: FormGroup;
  cityForm!: FormGroup;

  provinces = FILTER_PROVINCE_OPTIONS;
  zipCodesFiltered: ZipCodeListItem[] = [];

  citySelected!: ZipCodeListItem;
  citySearchCode = signal('');

  totalsPopulation!: Signal<{ [key: string]: { [key: string]: number } }>;

  constructor() {
    this.catPopulationService = inject(CatPopulationService);
    this.formBuilder = inject(FormBuilder);
    this.destroyRef = inject(DestroyRef);
    this.joinPostalCodesPipe = inject(JoinPostalCodesPipe);
    this.breakpointService = inject(BreakpointService);
  }

  ngOnInit(): void {
    this.initSignals();
    this.initForm();
  }

  private initForm(): void {
    this.provinceForm = this.formBuilder.group({
      province: new FormControl<string | undefined>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.cityForm = this.formBuilder.group({
      city: new FormControl<string | undefined>(undefined, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.provinceForm.controls['province']?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cityForm.controls['city']?.reset();
        this.cityForm.controls['city']?.setErrors(null);
        this.cityForm.controls['city']?.markAsPending();
      });

    this.cityForm.controls['city']?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const name = typeof value === 'string' ? value : value?.codi_municipi;
        this.zipCodesFiltered = name
          ? this._filter(name as string)
          : this.filterByProvinceCode();
      });
  }

  private initSignals(): void {
    this.zipCodes = toSignal(this.catPopulationService.getZipCodes(), {
      initialValue: undefined,
      injector: this.injector,
    });

    this.totalsPopulation = computed(() => {
      let data: { [key: string]: { [key: string]: number } } = {};
      this.populationData()?.forEach((item: PopulationDataResponse) => {
        data = {
          ...data,
          [item.any]: {
            men:
              parseInt(item.homes_de_0_a_14_anys) +
              parseInt(item.homes_de_15_a_64_anys) +
              parseInt(item.homes_de_65_anys_i_m_s),
            women:
              parseInt(item.dones_de_0_a_14_anys) +
              parseInt(item.dones_de_15_a_64_anys) +
              parseInt(item.dones_de_65_anys_i_m_s),
            total:
              parseInt(item.total_de_0_a_14_anys) +
              parseInt(item.total_de_15_a_64_anys) +
              parseInt(item.total_de_65_anys_i_m_s),
          },
        };
      });
      return data;
    });

    this.populationData = toSignal(
      toObservable<string>(this.citySearchCode, {
        injector: this.injector,
      }).pipe(
        filter((code) => !!code),
        takeUntilDestroyed(this.destroyRef),
        switchMap((code) => this.catPopulationService.getPopulationData(code))
      ),
      {
        initialValue: undefined,
        injector: this.injector,
      }
    );
  }

  filterByProvinceCode(): ZipCodeListItem[] {
    const codes = [this.provinceForm.controls['province'].value];

    if (this.provinceForm.controls['province'].value === ZIP_CODES.LLEIDA) {
      codes.push(ZIP_CODES.TREMP);
    }

    return (
      this.zipCodes()?.filter((item: ZipCodeListItem) => {
        return codes.includes(item.codi_postal[0].slice(0, 2));
      }) || []
    );
  }

  displayFn = (option: ZipCodeListItem): string => {
    return option
      ? `(${this.joinPostalCodesPipe.transform(option.codi_postal, 3)}) ${
          option.nom_municipi
        }`
      : '';
  };

  private _filter(name: string): ZipCodeListItem[] {
    const filterName = name.toLowerCase();

    return this.zipCodesFiltered.filter((item) =>
      item.nom_municipi.toLocaleLowerCase().includes(filterName)
    );
  }

  handleCitySelected(item: MatAutocompleteSelectedEvent): void {
    this.citySelected = item.option.value;
    this.citySearchCode.set(this.citySelected.codi_municipi);
  }

  handleSelectProvince(item: MatSelectChange): void {
    this.zipCodesFiltered = this.filterByProvinceCode();
  }
}
