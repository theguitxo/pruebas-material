import { NgFor } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';

export interface MenuItem {
  title: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-drawer-menu',
  templateUrl: './drawer-menu.component.html',
  standalone: true,
  imports: [NgFor, MatListModule, MatButtonModule, MatIconModule],
})
export class DrawerMenuComponent {
  @Input() drawerRef!: MatDrawer;

  private readonly router!: Router;

  constructor() {
    this.router = inject(Router);
  }

  menuItems: MenuItem[] = [
    {
      title: 'Home',
      path: 'home',
      icon: 'home',
    },
    {
      title: 'Disney API',
      path: 'disney-api',
      icon: 'movie',
    },
  ];

  navigate(path: string): void {
    this.drawerRef.toggle();
    this.router.navigate([path]);
  }
}
