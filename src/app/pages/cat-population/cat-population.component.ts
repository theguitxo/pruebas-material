import { NgFor, NgIf } from '@angular/common';
import { Component, inject, Injector, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { FILTER_PROVINCE_OPTIONS } from '../../constants/cat-population/zip-codes.constants';
import { ZipCodeItem } from '../../models/cat-population/zip-codes.model';
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
  ],
})
export class CatPopulationComponent implements OnInit {
  private readonly catPopulationService!: CatPopulationService;
  private injector = inject(Injector);
  private readonly formBuilder!: FormBuilder;

  zipCodes!: Signal<ZipCodeItem[] | undefined>;

  provinceForm!: FormGroup;
  cityForm!: FormGroup;

  provinces = FILTER_PROVINCE_OPTIONS;

  constructor() {
    this.catPopulationService = inject(CatPopulationService);
    this.formBuilder = inject(FormBuilder);
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
      }),
    });
  }

  private initSignals(): void {
    this.zipCodes = toSignal(this.catPopulationService.getZipCodes(), {
      initialValue: undefined,
      injector: this.injector,
    });
  }
}
