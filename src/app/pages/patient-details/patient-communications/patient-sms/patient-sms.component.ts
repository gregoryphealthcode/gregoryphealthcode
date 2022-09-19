import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { PatientSmsModel } from 'src/app/shared/services/patient.service';
import { PatientCommunicationStore } from '../patient-communications-store.service';

@Component({
  selector: 'app-patient-sms',
  templateUrl: './patient-sms.component.html',
  styleUrls: ['./patient-sms.component.scss']
})
export class PatientSmsComponent extends SubscriptionBase implements OnInit {
  sms: PatientSmsModel[] = [];
  filteredSms: PatientSmsModel[] = [];
  dateFormat: string;
  focusedRowIndex = 0;
  searchBoxValue = "";
  format = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  toDate: Date;
  fromDate: Date;

  constructor(
    private store: PatientCommunicationStore,
    public appInfo: AppInfoService,
    public datepipe: DatePipe
  ) {
    super();
    this.toDate=undefined;
    this.fromDate=undefined;
  }

  ngOnInit() {
    this.dateFormat = this.appInfo.getDateFormat;

    this.addToSubscription(this.store.sms$.pipe(tap(x => {
      this.sms = x;
      this.filteredSms = x;
      this.focusedRowIndex = 0;

      this.search();
    })));
  }

  search() {
    let search = this.searchBoxValue.toLocaleLowerCase();

    if (search == "")
      this.filteredSms = this.sms;
    else {
      if (this.format.test(search)) {
        this.filteredSms = this.sms.filter(x => x.smsDateTime != null &&  this.datepipe.transform(x.smsDateTime, this.dateFormat) == search)
      }
      else {
        this.filteredSms = this.sms.filter(x =>
          (x.messageText != null && (x.messageText.toLocaleLowerCase().includes(search) || x.messageText == search)) ||
          (x.phoneNumber != null && (x.phoneNumber.toLocaleLowerCase().includes(search) || x.phoneNumber.toLocaleLowerCase() == search)) ||
          (x.status != null && (x.status.toLocaleLowerCase().includes(search) || x.status.toLocaleLowerCase() == search))
        );
      }
    }

    if (this.fromDate) {
    this.fromDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate(), 0, 0, 0);
    this.filteredSms = this.filteredSms.filter(x => x.smsDateTime != null && new Date(x.smsDateTime) >= this.fromDate);
    }

    if (this.toDate) {      
    this.toDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate(), 23, 59, 59);
    this.filteredSms = this.filteredSms.filter(x => x.smsDateTime != null && new Date(x.smsDateTime) <= this.toDate);
    }

    this.focusedRowIndex = -1;
  }
}