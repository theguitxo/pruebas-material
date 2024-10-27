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
}
