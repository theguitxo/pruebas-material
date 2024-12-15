import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { map, of, Subject, switchMap, tap } from 'rxjs';
import { DataNotFoundComponent } from '../../components/data-not-found/data-not-found.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import {
  INITIAL_LIST_LIMIT,
  INITIAL_LIST_OFFSET,
  PAGE_SIZE_OPTIONS,
} from '../../constants/spotify-api/spotify-api.constants';
import {
  AlbumSearchResponse,
  AlbumSearchResult,
  ArtistSearchResponse,
  ArtistSearchResult,
  SearchType,
  SearchValues,
} from '../../models/spotify-api/spotify-api.model';
import { SpotifyAPIService } from '../../services/spotify-api.service';
import { ArtistAlbumDataComponent } from './components/artist-album-data/artist-album-data';
import { SpotifySearchFormComponent } from './components/search-form/spotify-search-form.component';

@Component({
  selector: 'app-spotify-api',
  templateUrl: './spotify-api.component.html',
  styleUrl: './spotify-api.component.scss',
  imports: [
    NgClass,
    PageTitleComponent,
    SpotifySearchFormComponent,
    ArtistAlbumDataComponent,
    MatPaginatorModule,
    DataNotFoundComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpotifyAPIComponent implements OnInit {
  private readonly spotifyService!: SpotifyAPIService;
  private readonly injector!: Injector;
  private readonly destroyRef!: DestroyRef;

  result!: Signal<ArtistSearchResult | AlbumSearchResult | undefined>;
  isArtist!: WritableSignal<boolean>;

  private readonly _search: Subject<void> = new Subject<void>();

  searchString!: string | undefined;
  searchType!: SearchType | undefined;

  listLimit = INITIAL_LIST_LIMIT;
  listOffset = INITIAL_LIST_OFFSET;
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  nextLink!: string;
  previousLink!: string;
  totalItems!: number;

  /**
   * Método constructor
   */
  constructor() {
    /**
     * Servicio para inyectar otros servicios
     */
    this.injector = inject(Injector);
    this.spotifyService = inject(SpotifyAPIService);
    this.destroyRef = inject(DestroyRef);
  }

  ngOnInit(): void {
    this.initSignals();
  }

  private initSignals(): void {
    this.isArtist = signal(false);

    this.result = toSignal(
      this._search.pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.isArtist.set(this.searchType === 'artist')),
        switchMap(() => {
          if (
            this.searchString !== undefined &&
            this.searchType !== undefined
          ) {
            return this.spotifyService.search(
              this.searchString,
              this.searchType,
              this.listLimit,
              this.listOffset
            );
          }
          return of(undefined);
        }),
        map(
          (
            response: ArtistSearchResponse | AlbumSearchResponse | undefined
          ) => {
            if (response !== undefined) {
              return this.setAlbumArtistData(response);
            }

            return undefined;
          }
        )
      ),
      {
        initialValue: undefined,
        injector: this.injector,
      }
    );
  }

  setAlbumArtistData(
    info: ArtistSearchResponse | AlbumSearchResponse
  ): ArtistSearchResult | AlbumSearchResult {
    const data = this.isArtist()
      ? (info as ArtistSearchResponse).artists
      : (info as AlbumSearchResponse).albums;
    this.previousLink = data.previous;
    this.nextLink = data.next;
    this.totalItems = data.total;
    return data;
  }

  handleClear(): void {
    this.searchString = undefined;
    this.searchType = undefined;
    this.listLimit = INITIAL_LIST_LIMIT;
    this.listOffset = INITIAL_LIST_OFFSET;
    this._search.next();
  }

  handleSearch(searchValues: SearchValues): void {
    this.searchString = searchValues.search;
    this.searchType = searchValues.type;
    this._search.next();
  }

  changePage(event: PageEvent): void {
    if (event.pageSize !== this.listLimit) {
      this.changePageLimit(event.pageSize);
    } else {
      this.nextPreviousPage(event);
    }
  }

  changePageLimit(pageLimit: number): void {
    this.listLimit = pageLimit;
    this.listOffset = 0;
    this._search.next();
  }

  nextPreviousPage(event: PageEvent) {
    const urlString =
      event.previousPageIndex !== undefined &&
      event.pageIndex > event.previousPageIndex
        ? this.nextLink
        : this.previousLink;

    const params = new URLSearchParams(new URL(urlString).search);
    const offset = params.get('offset');
    if (offset) {
      this.listOffset = parseInt(offset);
    }
    const limit = params.get('limit');
    if (limit) {
      this.listLimit = parseInt(limit);
    }
    this._search.next();
  }
}
