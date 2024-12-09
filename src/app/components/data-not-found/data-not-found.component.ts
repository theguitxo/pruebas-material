import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Componente para mostrar un mensaje que no se han encontrado datos
 */
@Component({
  selector: 'app-data-not-found',
  templateUrl: './data-not-found.component.html',
  styleUrl: './data-not-found.component.scss',
  imports: [MatIconModule],
})
export class DataNotFoundComponent {}
