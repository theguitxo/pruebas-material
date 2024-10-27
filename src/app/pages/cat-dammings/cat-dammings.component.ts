import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cat-dammings',
  templateUrl: './cat-dammings.component.html',
  styleUrl: './cat-dammings.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatDammingsComponent {}
