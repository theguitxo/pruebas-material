import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-data-not-found',
  templateUrl: './data-not-found.component.html',
  styleUrl: './data-not-found.component.scss',
  standalone: true,
  imports: [MatIconModule],
})
export class DataNotFoundComponent {}
