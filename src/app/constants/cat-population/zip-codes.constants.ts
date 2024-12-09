/**
 * Códigos postales de Cataluña
 */
export enum ZIP_CODES {
  BARCELONA = '08',
  TARRAGONA = '43',
  LLEIDA = '25',
  GIRONA = '17',
  TREMP = '22',
}

/**
 * Códigos para casos especiales
 */
export enum SPECIAL_ZIP_CODES {
  NO_CONSTA = '99999',
  OTROS_DIVERSOS = '99998',
}

/**
 * Nombres de las provincias
 */
export enum PROVINCE_NAMES {
  BARCELONA = 'Barcelona',
  TARRAGONA = 'Tarragona',
  LLEIDA = 'Lleida',
  GIRONA = 'Girona',
}

/**
 * Opciones para el selector de provincia
 */
export const FILTER_PROVINCE_OPTIONS: {
  code: ZIP_CODES;
  name: PROVINCE_NAMES;
}[] = [
  {
    code: ZIP_CODES.BARCELONA,
    name: PROVINCE_NAMES.BARCELONA,
  },
  {
    code: ZIP_CODES.GIRONA,
    name: PROVINCE_NAMES.GIRONA,
  },
  {
    code: ZIP_CODES.LLEIDA,
    name: PROVINCE_NAMES.LLEIDA,
  },
  {
    code: ZIP_CODES.TARRAGONA,
    name: PROVINCE_NAMES.TARRAGONA,
  },
];
