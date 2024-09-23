import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly overlay!: Overlay;

  overlayRef!: OverlayRef;
  loadingComponent!: ComponentPortal<LoadingSpinnerComponent>;

  constructor() {
    this.overlay = inject(Overlay);
    this.createOverlay();
  }

  private createOverlay(): void {
    this.overlayRef = this.overlay.create({
      width: '100%',
      height: '100%',
      hasBackdrop: true,
    });

    this.loadingComponent = new ComponentPortal(LoadingSpinnerComponent);
  }

  startLoading(): void {
    this.overlayRef.attach(this.loadingComponent);
  }

  stopLoading(): void {
    this.overlayRef.detach();
  }
}
