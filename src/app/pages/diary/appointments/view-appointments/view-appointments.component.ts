import { Component } from '@angular/core';
import { InputNotifier } from 'src/app/shared/helpers/other';
import { AppointmentViewModel } from 'src/app/shared/services/appointment.service';

@Component({
    selector: 'app-view-appointments',
    templateUrl: './view-appointments.component.html',
    host: { class: 'd-flex flex-column flex-grow-1' },
    styleUrls: ['./view-appointments.component.scss']
})
export class ViewAppointmentsComponent  {
  public showAppointmentPopup: boolean;
  public appointmentDataItem: AppointmentViewModel;
  public notifier = new InputNotifier();

  appointmentSelectedHandler(item:AppointmentViewModel){
    this.appointmentDataItem = item;
    this.showAppointmentPopup = true;
  }
}
