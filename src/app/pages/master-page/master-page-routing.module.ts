import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/guards/auth.guard';
import { AccessNotAllowedComponent } from '../redirects/access-not-allowed/access-not-allowed.component';
import { LocationSessionsComponent } from '../sessions/location-sessions.component';
import { NewPatientDetailsComponent } from '../patient-details/new-patient-details/new-patient-details.component';
import { NewPatientSearchComponent } from '../new-patient-search/new-patient-search.component';
import { ContactViewComponent } from '../contacts/contact-view/contact-view.component';
import { ListContactsComponent } from 'src/app/shared/components/contacts/contacts-list.component';
import { DiaryViewComponent } from '../diary-view/diary-view.component';

const routes: Routes = [
  {
    path: 'pages/access-not-allowed',
    component: AccessNotAllowedComponent,
    data: { accesskey: null },
    canActivate: [AuthGuardService]
  },
  {
    path: 'patient-details/:patientid',
    component: NewPatientDetailsComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'patient-details',
    component: NewPatientDetailsComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'patient-list',
    component: NewPatientSearchComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'sessions/location-sessions/:locationId',
    component: LocationSessionsComponent,
    data: { accesskey: 155 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'sessions/location-sessions',
    component: LocationSessionsComponent,
    data: { accesskey: 155 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'contacts/list-contacts',
    component: ListContactsComponent,
    data: { accesskey: 28 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'view-contact/:contactId',
    component: ContactViewComponent,
    data: { accesskey: 28 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'diary',
    component: DiaryViewComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterPageRoutingModule {
}