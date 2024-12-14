import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalImageViewerData } from '../../models/modal-image-viewer/modal-image-viewer.model';
import { ModalWrapperComponent } from '../modal-wrapper/modal-wrapper.component';

/**
 * Componente para motrar una imagen dentro de una modal
 */
@Component({
  selector: 'app-modal-image-viewer',
  templateUrl: './modal-image-viewer.component.html',
  styleUrl: './modal-image-viewer.component.scss',
  imports: [ModalWrapperComponent],
})
export class ModalImageViewerComponent implements OnInit {
  /**
   * Datos de la imagen para mostrar en la modal
   */
  data: ModalImageViewerData = inject(MAT_DIALOG_DATA);

  /**
   * Url a la imagen
   */
  url!: string;
  /**
   * Decripción para el parámetro alt de la imagen
   */
  description!: string;
  /**
   * Titulo para la modal
   */
  title!: string | undefined;

  /**
   * Inicio del componente
   */
  ngOnInit(): void {
    this.url = this.data.url;
    this.description = this.data.altImage;
    this.title = this.data.title;
  }
}
