import { DecimalPipe, JsonPipe } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  AlbumResultItem,
  ArtistResultItem,
  ImageItemInfo,
} from '../../../../models/spotify-api/spotify-api.model';

@Component({
  selector: 'app-artist-album-data',
  templateUrl: './artist-album-data.html',
  styleUrl: './artist-album-data.scss',
  standalone: true,
  imports: [
    JsonPipe,
    DecimalPipe,
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

  panelOpened = false;

  ngOnInit(): void {
    this.setArtistInfo();
    this.setImageInfo();
  }

  private setArtistInfo(): void {
    if (this.isArtist) {
      this.genres = (this.info as ArtistResultItem).genres;
      this.followers.set((this.info as ArtistResultItem).followers?.total);
      this.popularity.set((this.info as ArtistResultItem).popularity);

      if (this.info.external_urls) {
        this.spotifyUrl = this.info.external_urls['spotify'];
      }
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

  openSpotify(): void {
    window.open(this.spotifyUrl, '_blank');
  }
}
