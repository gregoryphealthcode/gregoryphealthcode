import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/shared/models/ResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SitePracticeHoursService {

  constructor(private http: HttpClient) {
  }

  public getCurrentSitePracticeHours(): Observable<DiaryTimesModel> {
    const url = `${environment.baseurl}/sitePracticeHours` ;
    return this.http.get<DiaryTimesModel>(url);
  }

  public setSitePracticeHours(model: any): Observable<ResponseModel> {
    const url = `${environment.baseurl}/sitePracticeHours`;
    return this.http.put<ResponseModel>(url, model);
  }
}

export interface DiaryTimesModel { 
  workDays: WorkDayInputModel[];
  minimumSlotDuration: number;
}

export interface WorkDayInputModel {
  day: DayEnum;
  working: boolean;
  startTime: WorkDayTime;
  endTime: WorkDayTime;
}

export class WorkDayTime {
  hours: number;
  minutes: number;

constructor()
constructor(hours: number, minutes: number)
constructor(hours?: number, minutes?: number) {
    this.hours = hours;
    this.minutes = minutes;
  }

  toViewString() {
    const hour = (this.hours < 10 ? '0' : '') + this.hours;
    const min = (this.minutes < 10 ? '0' : '') + this.minutes;
    return hour + ':' + min;
  }
}

export enum DayEnum {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7
}
