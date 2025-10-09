import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'grdFilter'
})
export class GrdFilterPipe implements PipeTransform {
  transform(items: any, filter: any, defaultFilter: boolean): any {
    if (!filter) {
      return items;
    }

    if (!Array.isArray(items)) {
      return items;
    }

    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      let found = filterKeys.filter((obj) => {
        return filter[obj];
      })
      if (!found.length) {
        return items;
      }
      if (defaultFilter) {
        return items.filter(item =>
          filterKeys.reduce((x: any, keyName: any) =>
            (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) && filter[keyName] !== "", true));
      }
      else {
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            return filter[keyName] !== "" && new RegExp(filter[keyName], 'gi').test(item[keyName]);
            // return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
          });
        });
      }
    }
  }
}
