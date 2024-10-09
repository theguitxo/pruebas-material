import { Component, inject, OnInit } from "@angular/core";
import { SpotifyAPIService } from "../../services/spotify-api.service";

@Component({
  selector: 'app-spotify-api',
  templateUrl: './spotify-api.component.html',
  standalone: true,
  providers: [
    SpotifyAPIService
  ]
})
export class SpotifyAPIComponent implements OnInit {
  private readonly spotifyService!: SpotifyAPIService;

  constructor() {
    this.spotifyService = inject(SpotifyAPIService);
  }

  ngOnInit(): void {
    this.spotifyService.getArtist().subscribe();
  }
}
