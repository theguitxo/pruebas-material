import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  AlbumResultItem,
  ArtistResultItem,
} from '../../../../models/spotify-api/spotify-api.model';

@Component({
  selector: 'app-artist-album-data',
  templateUrl: './artist-album-data.html',
  standalone: true,
  imports: [JsonPipe, MatExpansionModule],
})
export class ArtistAlbumDataComponent {
  @Input({ required: true }) isArtist!: boolean;
  @Input({ required: true }) info!: ArtistResultItem | AlbumResultItem;
}
