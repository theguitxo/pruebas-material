import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { EXTERNAL_URL_SPOTIFY_KEY } from '../../../../constants/spotify-api/spotify-api.constants';
import {
  AlbumResultItem,
  ArtistResultItem,
  ArtistResultItemBase,
  ImageItemInfo,
} from '../../../../models/spotify-api/spotify-api.model';

@Component({
  selector: 'app-artist-album-data',
  templateUrl: './artist-album-data.html',
  styleUrl: './artist-album-data.scss',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    MatChipsModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class ArtistAlbumDataComponent implements OnInit {
  @Input({ required: true }) isArtist!: boolean;
  @Input({ required: true }) info!: ArtistResultItem | AlbumResultItem;

  genres: string[] = [];
  followers = signal<number | undefined>(undefined);
  popularity = signal<number | undefined>(undefined);
  image = signal<ImageItemInfo | undefined>(undefined);
  spotifyUrl!: string;
  releaseDate!: string;
  totalTracks!: number;
  artistsList: { name: string; url: string }[] = [];

  panelOpened = false;

  ngOnInit(): void {
    this.setArtistAlbumInfo();
    this.setImageInfo();
  }

  private setArtistAlbumInfo(): void {
    if (this.isArtist) {
      this.genres = (this.info as ArtistResultItem).genres;
      this.followers.set((this.info as ArtistResultItem).followers?.total);
      this.popularity.set((this.info as ArtistResultItem).popularity);
    } else {
      this.releaseDate = (this.info as AlbumResultItem).release_date;
      this.totalTracks = (this.info as AlbumResultItem).total_tracks;

      this.artistsList = (this.info as AlbumResultItem).artists?.map(
        (item: ArtistResultItemBase) => ({
          name: item.name,
          url: item.external_urls[EXTERNAL_URL_SPOTIFY_KEY],
        })
      );
    }

    if (this.info.external_urls) {
      this.spotifyUrl = this.info.external_urls[EXTERNAL_URL_SPOTIFY_KEY];
    }
  }

  private setImageInfo(): void {
    let bigger!: ImageItemInfo;
    let current!: ImageItemInfo;

    this.info.images?.forEach((image: ImageItemInfo) => {
      let isBigger = false;
      if (!bigger || image.width > bigger?.width) {
        bigger = image;
        isBigger = true;
      }
      if ((!current || image.width > current?.width) && !isBigger) {
        current = image;
      }
      this.image.set(current);
    });
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }
}
