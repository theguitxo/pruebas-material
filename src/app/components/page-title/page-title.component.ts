import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TITLES } from '../../constants/routes.constants';

@Component({
  selector: 'app-page-title',
  template: ` <h3>{{ title() }}</h3>`,
  styles: [
    `
      h3 {
        font-size: 1.5rem;
        font-weight: normal;
      }
    `,
  ],
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
