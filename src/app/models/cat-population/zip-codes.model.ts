import { ZIP_CODES } from '../../constants/cat-population/zip-codes.constants';

export interface ZipCodeItem {
  identificador: string;
  codi_postal: string;
  codi_municipi: string;
  nom_municipi: string;
}

export interface ZipCodeListItem {
  codi_postal: string[];
  codi_municipi: string;
  nom_municipi: string;
}

export interface ZipCodesState {
  itemsList: ZipCodeListItem[];
  loading: boolean;
  loaded: boolean;
  errorLoading: boolean;
  provincesFilter: ZIP_CODES[];
}
