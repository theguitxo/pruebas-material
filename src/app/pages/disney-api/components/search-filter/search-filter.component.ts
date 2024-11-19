import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatExpansionModule,
  MatExpansionPanelActionRow,
} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface SearchForm {
  name: FormControl<string>;
}

@Component({
    selector: 'app-search-filter',
    templateUrl: './search-filter.component.html',
    imports: [
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionPanelActionRow,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SearchFilterComponent implements OnInit {
  @Output() emitSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() emitReset: EventEmitter<void> = new EventEmitter<void>();

  form!: FormGroup<SearchForm>;

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = new FormGroup<SearchForm>({
      name: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  search(): void {
    if (this.form.valid) {
      this.emitSearch.emit(this.form.controls.name.value);
    }
  }

  reset(): void {
    this.form.reset();
    this.emitReset.emit();
  }
}
