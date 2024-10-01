import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinPostalCodes',
  standalone: true,
})
export class JoinPostalCodesPipe implements PipeTransform {
  transform(value: string[]): string {
    return value.join(', ');
  }
}
