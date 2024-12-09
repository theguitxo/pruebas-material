import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { DrawerMenuComponent } from './components/drawer-menu/drawer-menu.component';

/**
 * Componente principal de la aplicación
 */
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    DrawerMenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  /**
   * Referencia al menú de la aplicación
   */
  @ViewChild('drawer', { static: true }) drawerRef!: MatDrawer;

  /**
   * Abre y cierra el menú de la apliación
   */
  toggleDrawer(): void {
    this.drawerRef.toggle();
  }
}
