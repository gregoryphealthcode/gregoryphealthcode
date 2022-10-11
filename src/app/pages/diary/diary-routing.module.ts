import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "src/app/shared/guards/auth.guard";
import { AppointmentSessionsComponent } from "./appointment-sessions/appointment-sessions.component";
import { ViewAppointmentsComponent } from "./appointments/view-appointments/view-appointments.component";
import { WaitingListAllComponent } from "./waiting-list/waiting-list.component";

const routes: Routes = [
  {
    path: 'view-appointment/:patientId',
    component: ViewAppointmentsComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'view-appointment',
    component: ViewAppointmentsComponent,
    data: { accesskey: 158 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'waiting-list',
    component: WaitingListAllComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'appointment-sessions',
    component: AppointmentSessionsComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiaryRoutingModule { }
