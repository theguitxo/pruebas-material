import { Routes } from '@angular/router';
import { ROUTES_PATHS } from './constants/routes.constants';

export const routes: Routes = [
  {
    path: ROUTES_PATHS.HOME,
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: ROUTES_PATHS.DISNEY_API,
    loadComponent: () =>
      import('./pages/disney-api/disney-api.component').then(
        (c) => c.DisneyAPIComponent
      ),
  },
  {
    path: ROUTES_PATHS.CAT_POPULATION,
    loadComponent: () =>
      import('./pages/cat-population/cat-population.component').then(
        (c) => c.CatPopulationComponent
      ),
  },
  {
    path: ROUTES_PATHS.SPOTIFY_API,
    loadComponent: () =>
      import('./pages/spotify-api/spotify-api.component').then(
        (c) => c.SpotifyAPIComponent
      ),
  },
  {
    path: ROUTES_PATHS.CAT_DAMMINGS,
    loadComponent: () =>
      import('./pages/cat-dammings/cat-dammings.component').then(
        (c) => c.CatDammingsComponent
      ),
  },
  { path: '', redirectTo: `/${ROUTES_PATHS.HOME}`, pathMatch: 'full' },
  { path: '**', redirectTo: `/${ROUTES_PATHS.HOME}` },
];
