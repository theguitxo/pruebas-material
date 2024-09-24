import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Injector,
  OnInit,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SimplePaginatorComponent } from '../../components/simple-paginator/simple-paginator.component';
import { BreakpointService } from '../../services/breakpoint.service';
import {
  DisneyAPIService,
  ResponseCharacterList,
  ResponseData,
} from '../../services/disney-api.service';
import { goToExternalLink } from '../../utils/external-link.util';

@Component({
  selector: 'app-disney-api',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    SimplePaginatorComponent,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './disney-api.component.html',
  styleUrl: './disney-api.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DisneyAPIComponent implements OnInit {
  private readonly disneyAPIService!: DisneyAPIService;
  breakpointService!: BreakpointService;

  private injector = inject(Injector);

  characters!: Signal<ResponseCharacterList | undefined>;

  constructor() {
    this.disneyAPIService = inject(DisneyAPIService);
    this.breakpointService = inject(BreakpointService);
  }

  columnsTitles: { [key: string]: string } = {
    _id: 'ID',
    name: 'Name',
    sourceUrl: 'Information Source',
  };
  dataSource: ResponseData[] = [];
  displayedColumns = ['_id', 'name'];
  displayedColumnsWithExpand = [
    ...this.displayedColumns,
    'sourceUrl',
    'expand',
  ];
  expandedElement: unknown;

  currentPage = 1;
  pageSize = 5;
  disablePreviousPage!: boolean;
  disableNextPage!: boolean;
  lastPage!: number;

  itemsExpandedInfo: { title: string; field: string }[] = [
    {
      title: 'Enemies',
      field: 'enemies',
    },
    {
      title: 'Films',
      field: 'films',
    },
    {
      title: 'Park Attractions',
      field: 'parkAttractions',
    },
    {
      title: 'Short Films',
      field: 'shortFilms',
    },
    {
      title: 'TV Shows',
      field: 'tvShows',
    },
    {
      title: 'VideoGames',
      field: 'videoGames',
    },
  ];

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
        this.dataSource = this.characters()?.data || [];

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

  openSourceUrl(event: MouseEvent, link: string): void {
    event.stopPropagation();
    goToExternalLink(link);
  }
}
