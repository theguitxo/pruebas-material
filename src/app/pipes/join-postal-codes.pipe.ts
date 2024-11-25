import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'joinPostalCodes',
  standalone: true,
})
export class JoinPostalCodesPipe implements PipeTransform {
  transform(value: string[], itemsToElipsis = 5): string {
    if (value?.length) {
      const itemsToShow = value.slice(0, itemsToElipsis)
      return `${itemsToShow.join(', ')}${
        value.length > itemsToElipsis ? ', ...' : ''
      }`
    }

    return ''
  }
}
