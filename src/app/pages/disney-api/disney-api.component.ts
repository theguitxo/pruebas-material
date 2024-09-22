import { JsonPipe, NgIf } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Injector,
  OnInit,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { SimplePaginatorComponent } from '../../components/simple-paginator/simple-paginator.component';
import {
  DisneyAPIService,
  ResponseCharacterList,
} from '../../services/disney-api.service';

@Component({
  selector: 'app-disney-api',
  standalone: true,
  imports: [JsonPipe, NgIf, MatTableModule, SimplePaginatorComponent],
  templateUrl: './disney-api.component.html',
})
export class DisneyAPIComponent implements OnInit {
  private readonly disneyAPIService!: DisneyAPIService;

  private injector = inject(Injector);

  characters!: Signal<ResponseCharacterList | undefined>;

  constructor() {
    this.disneyAPIService = inject(DisneyAPIService);
  }

  dataSource: { _id: number; name: string }[] = [];
  displayedColumns = ['_id', 'name'];

  currentPage = 1;
  pageSize = 5;
  disablePreviousPage!: boolean;
  disableNextPage!: boolean;
  lastPage!: number;

  ngOnInit(): void {
    this.initEffects();
    this.initSignals();
    this.loadData();
  }

  private initSignals(): void {
    this.characters = toSignal(this.disneyAPIService.allCharacters, {
      requireSync: true,
      injector: this.injector,
    });
  }

  private initEffects(): void {
    effect(
      () => {
        this.dataSource =
          this.characters()?.data.map((item) => ({
            _id: item._id,
            name: item.name,
          })) || [];

        this.lastPage = this.characters()?.info.totalPages ?? 1;
        this.disableNextPage = !this.characters()?.info.nextPage;
        this.disablePreviousPage = !this.characters()?.info.previousPage;
      },
      { injector: this.injector }
    );
  }

  private loadData(): void {
    this.disneyAPIService.currentPage = this.currentPage;
    this.disneyAPIService.pageSize = this.pageSize;
    this.disneyAPIService.getAllCharacters();
  }

  goPage(value: number): void {
    this.currentPage = value;
    this.loadData();
  }

  changePageSize(value: number): void {
    this.pageSize = value;
    this.currentPage = 1;
    this.loadData();
  }
}
