import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
  ],
})
export class ModalWrapperComponent {
  dialogRef!: MatDialogRef<ModalWrapperComponent>;

  @Input() title!: string | undefined;

  constructor() {
    this.dialogRef = inject(MatDialogRef<ModalWrapperComponent>);
  }

  close(value: unknown): void {
    this.dialogRef.close(value);
  }
}
