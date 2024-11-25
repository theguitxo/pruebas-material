import { AsyncPipe, DecimalPipe, NgTemplateOutlet } from '@angular/common'
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
} from '@angular/core'
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatStepper, MatStepperModule } from '@angular/material/stepper'
import { MatTabsModule } from '@angular/material/tabs'
import { filter, switchMap } from 'rxjs'
import { PageTitleComponent } from '../../components/page-title/page-title.component'
import {
  FILTER_PROVINCE_OPTIONS,
  ZIP_CODES,
} from '../../constants/cat-population/zip-codes.constants'
import {
  FormatedPopulationData,
  ListItemObject,
} from '../../models/cat-population/list.model'
import { PopulationDataResponse } from '../../models/cat-population/population-response.model'
import { ZipCodeListItem } from '../../models/cat-population/zip-codes.model'
import { JoinPostalCodesPipe } from '../../pipes/join-postal-codes.pipe'
import { BreakpointService } from '../../services/breakpoint.service'
import { CatPopulationService } from '../../services/cat-population.service'

@Component({
  selector: 'app-cat-population',
  templateUrl: './cat-population.component.html',
  styleUrl: './cat-population.component.scss',
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    PageTitleComponent,
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
  providers: [JoinPostalCodesPipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatPopulationComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper

  private readonly catPopulationService!: CatPopulationService
  private readonly injector = inject(Injector)
  private readonly formBuilder!: FormBuilder
  private readonly destroyRef!: DestroyRef
  private readonly joinPostalCodesPipe!: JoinPostalCodesPipe
  private readonly decimalPipe!: DecimalPipe

  breakpointService!: BreakpointService

  zipCodes!: Signal<ZipCodeListItem[] | undefined>
  populationData!: Signal<PopulationDataResponse[] | undefined>

  provinceForm!: FormGroup
  cityForm!: FormGroup

  provinces = FILTER_PROVINCE_OPTIONS
  zipCodesFiltered: ZipCodeListItem[] = []

  citySelected!: ZipCodeListItem
  citySearchCode = signal('')

  formatedPopulationData!: Signal<FormatedPopulationData[]>

  constructor() {
    this.catPopulationService = inject(CatPopulationService)
    this.formBuilder = inject(FormBuilder)
    this.destroyRef = inject(DestroyRef)
    this.joinPostalCodesPipe = inject(JoinPostalCodesPipe)
    this.breakpointService = inject(BreakpointService)
    this.decimalPipe = inject(DecimalPipe)
  }

  ngOnInit(): void {
    this.initSignals()
    this.initForm()
  }

  private initForm(): void {
    this.provinceForm = this.formBuilder.group({
      province: new FormControl<string | undefined>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    })

    this.cityForm = this.formBuilder.group({
      city: new FormControl<string | undefined>(undefined, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    })

    this.provinceForm.controls['province']?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cityForm.controls['city']?.reset()
        this.cityForm.controls['city']?.setErrors(null)
        this.cityForm.controls['city']?.markAsPending()
      })

    this.cityForm.controls['city']?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.zipCodesFiltered = value
          ? this._filter(value)
          : this.filterByProvinceCode()
      })
  }

  private initSignals(): void {
    this.zipCodes = toSignal(this.catPopulationService.getZipCodes(), {
      initialValue: undefined,
      injector: this.injector,
    })

    this.formatedPopulationData = computed(() => {
      const data = this.populationData()?.map(
        (item: PopulationDataResponse) => {
          return {
            id: window.crypto.randomUUID(),
            year: item.any,
            rows: [
              [
                this._getListItemObject('', false, false),
                this._getListItemObject('Hombres', false, false),
                this._getListItemObject('Mujeres', false, false),
                this._getListItemObject('Todos', false, false),
              ],
              [
                this._getListItemObject('De 0 a 14 años', false, true),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    item.homes_de_0_a_14_anys,
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    item.dones_de_0_a_14_anys,
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    item.total_de_65_anys_i_m_s,
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
              ],
              [
                this._getListItemObject('De 15 a 64 años', false, true),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    item.homes_de_15_a_64_anys,
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    item.dones_de_15_a_64_anys,
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    item.total_de_15_a_64_anys,
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
              ],
              [
                this._getListItemObject('65 años o más', false, true),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    item.homes_de_65_anys_i_m_s,
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    item.dones_de_15_a_64_anys,
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    item.total_de_65_anys_i_m_s,
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
              ],
              [
                this._getListItemObject('Total', false, true),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    parseInt(item.homes_de_0_a_14_anys) +
                      parseInt(item.homes_de_15_a_64_anys) +
                      parseInt(item.homes_de_65_anys_i_m_s),
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    parseInt(item.dones_de_0_a_14_anys) +
                      parseInt(item.dones_de_15_a_64_anys) +
                      parseInt(item.dones_de_65_anys_i_m_s),
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
                this._getListItemObject(
                  this.decimalPipe.transform(
                    parseInt(item.total_de_0_a_14_anys) +
                      parseInt(item.total_de_15_a_64_anys) +
                      parseInt(item.total_de_65_anys_i_m_s),
                    '1.0-0',
                    'es-ES'
                  ) ?? '',
                  true,
                  false
                ),
              ],
            ],
          }
        }
      )
      return data || []
    })

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
    )
  }

  _getListItemObject(
    value: string,
    number: boolean,
    titleLeft: boolean
  ): ListItemObject {
    return {
      id: window.crypto.randomUUID(),
      borderBottom: !!value,
      isNumber: number,
      isTitle: !number,
      isTitleLeft: titleLeft,
      value,
    }
  }

  filterByProvinceCode(): ZipCodeListItem[] {
    const codes = [this.provinceForm.controls['province'].value]

    if (this.provinceForm.controls['province'].value === ZIP_CODES.LLEIDA) {
      codes.push(ZIP_CODES.TREMP)
    }

    return (
      this.zipCodes()?.filter((item: ZipCodeListItem) => {
        return codes.includes(item.codi_postal[0].slice(0, 2))
      }) || []
    )
  }

  displayFn = (option: string): string => {
    const value = this.zipCodesFiltered?.find(
      (item: ZipCodeListItem) => item.codi_municipi === option
    )
    return value
      ? `(${this.joinPostalCodesPipe.transform(value.codi_postal, 3)}) ${
          value.nom_municipi
        }`
      : ''
  }

  private _filter(value: string): ZipCodeListItem[] {
    return this.zipCodesFiltered.filter(
      (item) =>
        item.nom_municipi.toLocaleLowerCase().includes(value.toLowerCase()) ||
        item.codi_municipi.includes(value)
    )
  }

  handleCitySelected(item: MatAutocompleteSelectedEvent): void {
    const selected = this.zipCodesFiltered.find(
      (code: ZipCodeListItem) => code.codi_municipi === item.option.value
    )
    if (selected) {
      this.citySelected = selected
      this.citySearchCode.set(this.citySelected.codi_municipi)
    }
  }
}
