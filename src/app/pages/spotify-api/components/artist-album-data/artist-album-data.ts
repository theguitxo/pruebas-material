import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
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
  imports: [JsonPipe, NgIf, NgFor, MatExpansionModule, MatChipsModule, MatBadgeModule],
})
export class ArtistAlbumDataComponent implements OnInit {
  @Input({ required: true }) isArtist!: boolean;
  @Input({ required: true }) info!: ArtistResultItem | AlbumResultItem;

  genres!: string[];
  followers!: number;
  popularity!: number;
  artistImage!: ImageItemInfo | undefined;

  ngOnInit(): void {
    if (this.isArtist) {
      this.genres = (this.info as ArtistResultItem).genres;
      this.followers = (this.info as ArtistResultItem).followers?.total;
      this.popularity = (this.info as ArtistResultItem).popularity;

      this.artistImage = this.info.images?.find(item => item.width < 320);
    }
  }
}
