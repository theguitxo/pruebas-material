import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';

/**
 * Servicio para controlar cuando mostrar un gráfico de progreso de carga
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  /**
   * Servicio de Angular para manejar el Overlay
   */
  private readonly overlay!: Overlay;
  /**
   * Referencia al Overlay de Angular
   */
  overlayRef!: OverlayRef;
  /**
   * Componente del spinner loading
   */
  loadingComponent!: ComponentPortal<LoadingSpinnerComponent>;
  /**
   * Indicador si esta cargando o no
   */
  isLoading = false;

  /**
   * Método constructor
   */
  constructor() {
    this.overlay = inject(Overlay);
    this.createOverlay();
  }

  /**
   * Crea el contenedor para elementos flotantes que contendrá el spinner loading
   */
  private createOverlay(): void {
    this.overlayRef = this.overlay.create({
      width: '100%',
      height: '100%',
      hasBackdrop: true,
    });

    this.loadingComponent = new ComponentPortal(LoadingSpinnerComponent);
  }

  /**
   * Muestra el spinner loading
   */
  startLoading(): void {
    if (!this.isLoading) {
      this.isLoading = true;
      this.overlayRef.attach(this.loadingComponent);
    }
  }

  /**
   * Oculta el spinner loading
   */
  stopLoading(): void {
    this.isLoading = false;
    this.overlayRef.detach();
  }
}
