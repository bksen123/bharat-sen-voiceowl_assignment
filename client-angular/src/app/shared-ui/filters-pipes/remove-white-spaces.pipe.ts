import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeWhiteSpaces',
  standalone: true
})
export class RemoveWhiteSpacesPipe implements PipeTransform {
  transform(value: string, args?: any): any {
    if (value) {
      value = value.replace(/[.]/g, "");
      value = value.replace(/[.\s]/g, "-");
      return value;
    }
  }
}
