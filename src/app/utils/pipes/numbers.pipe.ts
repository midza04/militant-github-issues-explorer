import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numbers',
})
export class NumbersPipe implements PipeTransform {
  transform(value: number | string, locale?: string): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '';
    }
    const userLocale = locale || navigator.language || 'de-DE';
    return new Intl.NumberFormat(userLocale).format(Number(value));
  }
}
