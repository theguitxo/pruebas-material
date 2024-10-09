import { HttpClient, HttpContext } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { SPOTIFY_REQUEST } from "../utils/http-context.util";

@Injectable({
  providedIn: 'any'
})
export class SpotifyAPIService {
  private readonly CLIENT = '40a7ec852b9f4dbb9daaedd86ab8239a';
  private readonly SECRET = '70263a73066d41229e51903cd81bf9d9';

  private readonly http!: HttpClient;

  context = new HttpContext().set(SPOTIFY_REQUEST, true);

  constructor() {
    this.http = inject(HttpClient);
  }

  getToken(): Observable<any> {
    const body = `grant_type=client_credentials&client_id=${this.CLIENT}&client_secret=${this.SECRET}`
    return this.http.post(<any>'https://accounts.spotify.com/api/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).pipe(map(token => token));
  }

  getArtist() {
    return this.http.get('https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg', {
      context: this.context
    });
  }
}
