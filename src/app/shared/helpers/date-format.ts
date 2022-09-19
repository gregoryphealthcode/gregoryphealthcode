
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import { OverlayKeyboardDispatcher } from '@angular/cdk/overlay';


// export class AppDateAdapter extends NativeDateAdapter {
//   format(date: Date, displayFormat: Object): string {
//     if (displayFormat ===  'input') {
//       let day: string = date.getDate().toString();
//       day = +day < 10 ? '0' + day : day;
//       let month: string = (date.getMonth() + 1).toString();
//       month = +month < 10 ? '0' + month : month;
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     }
//     return date.toDateString();
//   }
// }

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const toIsoString = (date: Date): string =>  {
  let pad = function(num) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    };

return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    '.000Z';
}

export const setObjectDatePropertiesToIsoString = (record:any): any =>{
  for (const key in record) {
    if (record.hasOwnProperty(key) && record[key] instanceof Date) {
      record[key] = toIsoString(record[key]);
    }
  }
}


