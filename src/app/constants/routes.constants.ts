/**
 * Listado de rutas de la aplicación
 */
export enum ROUTES_PATHS {
  HOME = 'home',
  DISNEY_API = 'disney-api',
  CAT_POPULATION = 'cat-population',
  SPOTIFY_API = 'spotify-api',
  CAT_DAMMINGS = 'cat-dammings',
}

/**
 * Listado de titulos de las secciones según la ruta
 */
export const TITLES = {
  [ROUTES_PATHS.HOME]: 'Inicio',
  [ROUTES_PATHS.DISNEY_API]: 'Personajes de Disney',
  [ROUTES_PATHS.SPOTIFY_API]: 'Artistas y albumes de Spotify',
  [ROUTES_PATHS.CAT_POPULATION]: 'Población de Cataluña',
  [ROUTES_PATHS.CAT_DAMMINGS]: 'Embalses de Cataluña',
};
