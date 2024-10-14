import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-artist-album-data',
  templateUrl: './artist-album-data.html',
  standalone: true
})
export class ArtistAlbumDataComponent {

  @Input({required: true}) isArtist!: boolean;
}
