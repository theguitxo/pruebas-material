import { NgFor } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';

export interface MenuItem {
  title: string;
  path: string;
  icon: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    NgFor,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('drawer') drawerRef!: MatDrawer;

  private readonly router!: Router;

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

  constructor() {
    this.router = inject(Router);
  }
  toggleDrawer(): void {
    this.drawerRef.toggle();
  }

  navigate(path: string): void {
    this.toggleDrawer();
    this.router.navigate([path]);
  }
}
