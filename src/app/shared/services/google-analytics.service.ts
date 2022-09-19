import { Injectable } from '@angular/core';

// tslint:disable-next-line: ban-types
declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null ) {
         gtag('event', eventName, {
                 eventCategory,
                 eventLabel,
                 eventAction,
                 eventValue
               });
    }

  constructor() { }
}
