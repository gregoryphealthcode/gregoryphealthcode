import { Component, OnInit } from '@angular/core';
import { InputNotifier } from 'src/app/shared/helpers/other';
import { AppointmentViewModel } from 'src/app/shared/services/appointment.service';

@Component({
  selector: 'app-medsec-diary-view',
  templateUrl: './medsec-diary-view.component.html',
  styleUrls: ['./medsec-diary-view.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class MedsecDiaryViewComponent implements OnInit {

  public showAppointmentPopup: boolean;
  public appointmentId: string;
  public notifier = new InputNotifier();

  constructor() { }

  ngOnInit() {
  }

  appointmentSelectedHandler(item:AppointmentViewModel){
    this.appointmentId = item.appointmentId;
    this.showAppointmentPopup = true;
  }

}
