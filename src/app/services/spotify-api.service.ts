import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Buffer } from 'buffer';
@Injectable({
  providedIn: 'any'
})
export class SpotifyAPIService {
  private readonly CLIENT = '40a7ec852b9f4dbb9daaedd86ab8239a';
  private readonly TOKEN = '70263a73066d41229e51903cd81bf9d9';

  private readonly http!: HttpClient;

  constructor() {
    this.http = inject(HttpClient);
  }

  searchArtists(query: string) {
    const a = Buffer.from(this.CLIENT + ':' + this.TOKEN).toString('base64');
    this.http.post('https://accounts.spotify.com/api/token',null, {
      headers: {
        'Authorization': 'Basic ' + a
      }
    }).subscribe();
  }
}
