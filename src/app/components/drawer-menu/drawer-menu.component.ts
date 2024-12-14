import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ROUTES_PATHS, TITLES } from '../../constants/routes.constants';
import { MenuItem } from '../../models/drawer-menu/drawer-menu.model';

/**
 * Componente para el menú lateral de la aplicación
 */
@Component({
  selector: 'app-drawer-menu',
  templateUrl: './drawer-menu.component.html',
  styleUrl: './drawer-menu.component.scss',
  imports: [MatListModule, MatButtonModule, MatIconModule],
})
export class DrawerMenuComponent {
  /**
   * Referencia al MatDrawer que contiene el menú
   */
  @Input() drawerRef!: MatDrawer;

  /**
   * Servicio Router de Angular
   */
  private readonly router!: Router;

  /**
   * Lista de opciones del menú
   */
  menuItems: MenuItem[] = [
    {
      title: TITLES[ROUTES_PATHS.HOME],
      path: ROUTES_PATHS.HOME,
      icon: 'home',
    },
    {
      title: TITLES[ROUTES_PATHS.DISNEY_API],
      path: ROUTES_PATHS.DISNEY_API,
      icon: 'movie',
    },
    {
      title: TITLES[ROUTES_PATHS.SPOTIFY_API],
      path: ROUTES_PATHS.SPOTIFY_API,
      icon: 'music_note',
    },
    {
      title: TITLES[ROUTES_PATHS.CAT_POPULATION],
      path: ROUTES_PATHS.CAT_POPULATION,
      icon: 'public',
    },
    {
      title: TITLES[ROUTES_PATHS.CAT_DAMMINGS],
      path: ROUTES_PATHS.CAT_DAMMINGS,
      icon: 'water',
    },
  ];

  /**
   * Método contructor
   */
  constructor() {
    this.router = inject(Router);
  }

  /**
   * Navega a una de la opciones del menú
   * @param {string} path Ruta a la que ha de navegar
   */
  navigate(path: string): void {
    this.drawerRef.toggle();
    this.router.navigate([path]);
  }
}
