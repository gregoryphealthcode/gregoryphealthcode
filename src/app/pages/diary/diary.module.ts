import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppointmentSessionsModule } from "./appointment-sessions/appointment-sessions.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { DiaryRoutingModule } from "./diary-routing.module";
import { WaitingListModule } from "./waiting-list/waiting-list.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DiaryRoutingModule,
    AppointmentsModule,
    AppointmentSessionsModule,
    WaitingListModule,
  ]
})

export class DiaryModule { }