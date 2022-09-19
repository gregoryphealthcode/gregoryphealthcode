import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AppInfoService } from '../services';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe  implements PipeTransform {

  constructor(private appInfo: AppInfoService) { }

  transform(date: Date | string, showTime: boolean = false): string {
    date = new Date(date);  // if orginal type was a string

    let format = this.appInfo.getDateFormat;

    if(showTime){
      format += ' hh:mm';
    }

    return new DatePipe('en-US').transform(date, format);
  }

}
