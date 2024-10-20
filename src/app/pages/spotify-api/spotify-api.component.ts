import {
  Component,
  DestroyRef,
  inject,
  Injector,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { map, Subject, switchMap, tap } from 'rxjs';
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
  standalone: true,
  imports: [
    SpotifySearchFormComponent,
    ArtistAlbumDataComponent,
    MatPaginatorModule,
  ],
  providers: [SpotifyAPIService],
})
export class SpotifyAPIComponent implements OnInit {
  private readonly spotifyService!: SpotifyAPIService;
  private readonly injector!: Injector;
  private readonly destroyRef!: DestroyRef;

  result!: Signal<ArtistSearchResult | AlbumSearchResult | undefined>;
  isArtist = signal<boolean>(false);

  private readonly _search: Subject<void> = new Subject<void>();

  searchString!: string;
  searchType!: SearchType;

  listLimit = 10;
  listOffset = 0;
  pageSizeOptions = [10, 20, 30];
  nextLink!: string;
  previousLink!: string;
  totalItems!: number;

  constructor() {
    this.injector = inject(Injector);
    this.spotifyService = inject(SpotifyAPIService);
    this.destroyRef = inject(DestroyRef);
  }

  ngOnInit(): void {
    this.initSignals();
    this.handleSearch({
      search: 'aerosmith',
      type: 'artist',
    });
  }

  private initSignals(): void {
    this.result = toSignal(
      this._search.pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.isArtist.set(this.searchType === 'artist')),
        switchMap(() =>
          this.spotifyService.search(
            this.searchString,
            this.searchType,
            this.listLimit,
            this.listOffset
          )
        ),
        map((response: ArtistSearchResponse | AlbumSearchResponse) => {
          const data = this.isArtist()
            ? (response as ArtistSearchResponse).artists
            : (response as AlbumSearchResponse).albums;
          this.previousLink = data.previous;
          this.nextLink = data.next;
          this.totalItems = data.total;
          return data;
        })
      ),
      {
        initialValue: undefined,
        injector: this.injector,
      }
    );
  }

  handleClear(): void {
    console.log('clear button');
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
