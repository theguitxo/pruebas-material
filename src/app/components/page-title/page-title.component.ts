import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TITLES } from '../../constants/routes.constants';

@Component({
  selector: 'app-page-title',
  template: ` <h5>{{ title() }}</h5> `,
  standalone: true,
})
export class PageTitleComponent implements OnInit {
  private readonly activatedRoute!: ActivatedRoute;

  title = signal<string | undefined>(undefined);

  constructor() {
    this.activatedRoute = inject(ActivatedRoute);
  }

  ngOnInit(): void {
    const path = this.activatedRoute.snapshot.routeConfig?.path;
    if (path) {
      const value = Object.entries(TITLES).find(
        (item: string[]) => item[0] === path
      );
      if (value) {
        this.title.set(value[1]);
      }
    }
  }
}
