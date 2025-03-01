import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DataNotFoundComponent } from '../../components/data-not-found/data-not-found.component';
import { ModalImageViewerComponent } from '../../components/modal-image-viewer/modal-image-viewer.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { SimplePaginatorComponent } from '../../components/simple-paginator/simple-paginator.component';
import {
  ResponseCharacterList,
  ResponseData,
} from '../../models/disney-api/disney-api.model';
import { ModalImageViewerData } from '../../models/modal-image-viewer/modal-image-viewer.model';
import { BreakpointService } from '../../services/breakpoint.service';
import { DisneyAPIService } from '../../services/disney-api.service';
import { LoadingService } from '../../services/loading.service';
import { goToExternalLink } from '../../utils/external-link.util';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';

@Component({
  selector: 'app-disney-api',
  imports: [
    PageTitleComponent,
    AsyncPipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    SimplePaginatorComponent,
    MatCardModule,
    MatChipsModule,
    SearchFilterComponent,
    DataNotFoundComponent,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisneyAPIComponent implements OnInit {
  private readonly disneyAPIService!: DisneyAPIService;
  /**
   * Servicio para manejar modales
   */
  private readonly dialog!: MatDialog;
  /**
   * Servicio para mostrar y ocultar el loading spinner
   */
  public readonly loadingService!: LoadingService;
  private readonly cdr!: ChangeDetectorRef;

  /**
   * Servicio de Angular para monitorizar los cambios entre diferentes resoluciones de dispositivos
   */
  breakpointService!: BreakpointService;

  /**
   * Servicio para inyectar otros servicios
   */
  private readonly injector = inject(Injector);

  characters!: Signal<ResponseCharacterList | undefined>;

  /**
   * Método constructor
   */
  constructor() {
    this.disneyAPIService = inject(DisneyAPIService);
    this.breakpointService = inject(BreakpointService);
    this.dialog = inject(MatDialog);
    this.loadingService = inject(LoadingService);
    this.cdr = inject(ChangeDetectorRef);
  }

  columnsTitles: { [key: string]: string } = {
    _id: 'ID',
    name: 'Nombre',
    sourceUrl: 'Fuende de información',
    imageUrl: 'Imagen',
  };
  dataSource: ResponseData[] = [];
  displayedColumns = ['_id', 'name'];
  displayedColumnsWithExpand = [
    ...this.displayedColumns,
    'sourceUrl',
    'imageUrl',
    'expand',
  ];
  expandedElement: unknown;

  currentPage = 1;
  pageSize = 5;
  disablePreviousPage!: boolean;
  disableNextPage!: boolean;
  lastPage!: number;
  filterSearch!: string | undefined;

  itemsExpandedInfo: { title: string; field: string }[] = [
    {
      title: 'Enemigos',
      field: 'enemies',
    },
    {
      title: 'Películas',
      field: 'films',
    },
    {
      title: 'Parque de atracciones',
      field: 'parkAttractions',
    },
    {
      title: 'Cortos',
      field: 'shortFilms',
    },
    {
      title: 'Programas de TV',
      field: 'tvShows',
    },
    {
      title: 'Videojuegos',
      field: 'videoGames',
    },
  ];

  ngOnInit(): void {
    this.initEffects();
    this.initSignals();
    this.loadData();
  }

  private initSignals(): void {
    this.characters = toSignal(this.disneyAPIService.charactersList, {
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

        this.cdr.detectChanges();
      },
      { injector: this.injector }
    );
  }

  private loadData(): void {
    this.disneyAPIService.currentPage = this.currentPage;
    this.disneyAPIService.pageSize = this.pageSize;

    if (this.filterSearch) {
      this.disneyAPIService.filterCharacters(this.filterSearch);
    } else {
      this.disneyAPIService.getAllCharacters();
    }
  }

  search(name: string): void {
    this.currentPage = 1;
    this.filterSearch = name;
    this.loadData();
  }

  resetSearch(): void {
    this.currentPage = 1;
    this.filterSearch = undefined;
    this.loadData();
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

  openImage(event: MouseEvent, url: string, name: string): void {
    event.stopPropagation();

    const data: ModalImageViewerData = {
      url,
      altImage: name,
      title: name,
    };

    this.dialog.open(ModalImageViewerComponent, {
      data,
    });
  }
}
