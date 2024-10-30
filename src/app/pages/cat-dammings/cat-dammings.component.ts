import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CatDammingsService } from '../../services/cat-dammings.service';

@Component({
  selector: 'app-cat-dammings',
  templateUrl: './cat-dammings.component.html',
  styleUrl: './cat-dammings.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatDammingsComponent implements OnInit {
  dammingsService!: CatDammingsService;

  constructor() {
    this.dammingsService = inject(CatDammingsService);
  }

  ngOnInit(): void {
    this.dammingsService.loadData();
  }
}
