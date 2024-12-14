import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

/**
 * Comonente contenedor para abrir modales
 */
@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.component.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
  ],
})
export class ModalWrapperComponent {
  /**
   * Referencia a MatDialogRef de tipo del componente que se abre con el modal
   */
  dialogRef!: MatDialogRef<ModalWrapperComponent>;

  /**
   * Titulo a motrar en el modal
   */
  @Input() title!: string | undefined;

  /**
   * Método constructor
   */
  constructor() {
    this.dialogRef = inject(MatDialogRef<ModalWrapperComponent>);
  }

  /**
   * Cierra el modal
   * @param {unknown} value Valor a devolver en el observable al cerrar el modal
   */
  close(value: unknown): void {
    this.dialogRef.close(value);
  }
}
