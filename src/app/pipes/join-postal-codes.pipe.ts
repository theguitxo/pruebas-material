import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforma una lista de códigos postales en una cadena de texto con un limite de elementos a mostrar, mostrando '...' si el total de elemntos es mayor que el limite
 */
@Pipe({
  name: 'joinPostalCodes',
  standalone: true,
})
export class JoinPostalCodesPipe implements PipeTransform {
  /**
   * Transforma una lista de de códigos postales
   * @param {string[]} value Lista de códigos postales
   * @param {number} itemsToElipsis Número de elementos a mostrar en la cadena
   */
  transform(value: string[], itemsToElipsis = 5): string {
    if (value?.length) {
      const itemsToShow = value.slice(0, itemsToElipsis);
      return `${itemsToShow.join(', ')}${
        value.length > itemsToElipsis ? ', ...' : ''
      }`;
    }

    return '';
  }
}
