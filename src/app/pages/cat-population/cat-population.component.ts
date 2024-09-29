import { NgFor, NgIf } from '@angular/common';
import {
  Component,
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
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { filter, switchMap } from 'rxjs';
import {
  FILTER_PROVINCE_OPTIONS,
  ZIP_CODES,
} from '../../constants/cat-population/zip-codes.constants';
import { PopulationDataResponse } from '../../models/cat-population/population-response.model';
import { ZipCodeListItem } from '../../models/cat-population/zip-codes.model';
import { CatPopulationService } from '../../services/app-population.service';

@Component({
  selector: 'app-cat-population',
  templateUrl: './cat-population.component.html',
  styleUrl: './cat-population.component.scss',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
})
export class CatPopulationComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  private readonly catPopulationService!: CatPopulationService;
  private readonly injector = inject(Injector);
  private readonly formBuilder!: FormBuilder;
  private readonly destroyRef!: DestroyRef;

  zipCodes!: Signal<ZipCodeListItem[] | undefined>;
  populationData!: Signal<PopulationDataResponse[] | undefined>;

  provinceForm!: FormGroup;
  cityForm!: FormGroup;

  provinces = FILTER_PROVINCE_OPTIONS;
  zipCodesFiltered: ZipCodeListItem[] = [];

  citySelected!: ZipCodeListItem;
  citySearchCode = signal('');

  constructor() {
    this.catPopulationService = inject(CatPopulationService);
    this.formBuilder = inject(FormBuilder);
    this.destroyRef = inject(DestroyRef);
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
      city: new FormControl<string | undefined>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
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

  displayFn(option: ZipCodeListItem): string {
    return option
      ? `(${option.codi_postal.join(', ')}) ${option.nom_municipi}`
      : '';
  }

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
