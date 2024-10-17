import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
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
    NgIf,
    NgFor,
    MatExpansionModule,
    MatChipsModule,
    MatBadgeModule,
    MatButtonModule,
  ],
})
export class ArtistAlbumDataComponent implements OnInit {
  @Input({ required: true }) isArtist!: boolean;
  @Input({ required: true }) info!: ArtistResultItem | AlbumResultItem;

  genres: string[] = [];
  followers!: number;
  popularity!: number;
  image!: ImageItemInfo | undefined;
  spotifyUrl!: string;

  panelOpened = false;

  ngOnInit(): void {
    this.setArtistInfo();
    this.setImageInfo();
  }

  private setArtistInfo(): void {
    if (this.isArtist) {
      this.genres = (this.info as ArtistResultItem).genres;
      this.followers = (this.info as ArtistResultItem).followers?.total;
      this.popularity = (this.info as ArtistResultItem).popularity;

      if (this.info.external_urls) {
        this.spotifyUrl = this.info.external_urls['spotify'];
      }
    }
  }

  private setImageInfo(): void {
    this.info.images?.forEach((image: ImageItemInfo) => {
      if (!this.image || image.width < this.image?.width) {
        this.image = image;
      }
    });
  }

  openSpotify(): void {
    window.open(this.spotifyUrl, '_blank');
  }
}
