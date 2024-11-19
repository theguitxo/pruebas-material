import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalWrapperComponent } from '../modal-wrapper/modal-wrapper.component';

export interface ModalImageViewerData {
  url: string;
  altImage: string;
  title?: string;
}

@Component({
    selector: 'app-modal-image-viewer',
    templateUrl: './modal-image-viewer.component.html',
    styleUrl: './modal-image-viewer.component.scss',
    imports: [ModalWrapperComponent]
})
export class ModalImageViewerComponent implements OnInit {
  data: ModalImageViewerData = inject(MAT_DIALOG_DATA);

  url!: string;
  description!: string;
  title!: string | undefined;

  ngOnInit(): void {
    this.url = this.data.url;
    this.description = this.data.altImage;
    this.title = this.data.title;
  }
}
