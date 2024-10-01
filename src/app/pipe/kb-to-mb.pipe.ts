import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kbToMb',
  standalone: true
})
export class KbToMbPipe implements PipeTransform {

  transform(value: number, decimalPlaces: number = 2): string {
    if (!value) return '0 MB';
    const mbValue = value / 1024;
    return `${mbValue.toFixed(decimalPlaces)} MB`;
  }

}
