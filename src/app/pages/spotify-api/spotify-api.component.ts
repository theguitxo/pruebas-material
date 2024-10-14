import { JsonPipe, NgIf } from '@angular/common';
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
import { SpotifySearchFormComponent } from './components/search-form/spotify-search-form.component';
import { ArtistAlbumDataComponent } from './components/artist-album-data/artist-album-data';

@Component({
  selector: 'app-spotify-api',
  templateUrl: './spotify-api.component.html',
  standalone: true,
  imports: [JsonPipe, NgIf, SpotifySearchFormComponent, ArtistAlbumDataComponent],
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

  constructor() {
    this.injector = inject(Injector);
    this.spotifyService = inject(SpotifyAPIService);
    this.destroyRef = inject(DestroyRef);
  }

  ngOnInit(): void {
    this.initSignals();
  }

  private initSignals(): void {
    this.result = toSignal(
      this._search.pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.isArtist.set(this.searchType === 'artist')),
        switchMap(() =>
          this.spotifyService.search(this.searchString, this.searchType)
        ),map((response: ArtistSearchResponse | AlbumSearchResponse) => {
          if (this.isArtist()) {
            return (response as ArtistSearchResponse).artists;
          }
          return (response as AlbumSearchResponse).albums;
        })
      ),
      {
        initialValue: undefined,
        injector: this.injector,
      }
    );
  }

  handleClear(): void {}

  handleSearch(searchValues: SearchValues): void {
    this.searchString = searchValues.search;
    this.searchType = searchValues.type;
    this._search.next();
  }
}
