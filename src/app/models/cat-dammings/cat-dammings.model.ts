import { FormControl } from '@angular/forms';

export interface DammingsInfoResponse {
  dia: string;
  estaci: string;
  nivell_absolut: string;
  percentatge_volum_embassat: string;
  volum_embassat: string;
}

export interface DammingsInfoItem extends DammingsInfoResponse {
  id: string;
  id_estaci: string;
  date: Date;
}

export interface StationItem {
  key: string;
  name: string;
}

export interface FilterForm {
  date: FormControl<Date | undefined>;
  stations: FormControl<string[] | undefined>;
}

export interface FilteredInfoItem {
  id_estaci: string;
  estaci: string;
  nivell_absolut: string;
  percentatge_volum_embassat: string;
  volum_embassat: string;
}

export interface FilteredInfoItemDate extends FilteredInfoItem {
  dia: Date;
}

export interface DammingsInfo {
  maxDate: Date;
  minDate: Date;
  stations: StationItem[];
  list: DammingsInfoItem[];
}
