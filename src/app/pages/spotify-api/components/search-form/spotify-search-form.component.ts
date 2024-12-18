import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
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
import {
  SearchValues,
  SpotifySearchForm,
  TypeOption,
} from '../../../../models/spotify-api/spotify-api.model';

@Component({
    selector: 'app-spotify-search-form',
    templateUrl: './spotify-search-form.component.html',
    styleUrl: './spotify-search-form.component.scss',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
    ]
})
export class SpotifySearchFormComponent implements OnInit {
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();
  @Output() search: EventEmitter<SearchValues> =
    new EventEmitter<SearchValues>();

  form!: FormGroup<SpotifySearchForm>;

  typeOptions: TypeOption[] = [
    {
      value: undefined,
      text: 'Seleccione el tipo de búsqueda',
    },
    {
      value: 'album',
      text: 'Album',
    },
    {
      value: 'artist',
      text: 'Artista',
    },
  ];

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup<SpotifySearchForm>({
      search: new FormControl(undefined, {
        validators: Validators.required,
        nonNullable: true,
      }),
      type: new FormControl(undefined, {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  clearForm(): void {
    this.form.reset();
    this.clear.emit();
  }

  submitForm(): void {
    if (this.form.controls.search.value && this.form.controls.type.value) {
      const searchValues: SearchValues = {
        search: this.form.controls.search.value,
        type: this.form.controls.type.value,
      };

      this.search.emit(searchValues);
    }
  }

  handleSearchEnter(event: Event): void {
    event.preventDefault();
    this.submitForm();
  }
}
