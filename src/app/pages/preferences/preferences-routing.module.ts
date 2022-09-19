import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "src/app/shared/guards/auth.guard";
import { AccountsPreferencesComponent } from "./accounts/accounts-preferences/accounts-preferences.component";
import { PreferencesAppointmentOwnersComponent } from "./preferences-appointments/preferences-appointment-owners/preferences-appointment-owners.component";
import { PreferencesAppointmentsComponent } from "./preferences-appointments/preferences-appointments.component";
import { PreferencesContactsComponent } from "./preferences-contacts/preferences-contacts.component";
import { PreferencesDocumentsComponent } from "./preferences-documents/preferences-documents.component";
import { PreferencesIntegrationServicesComponent } from "./preferences-integration-services/preferences-integration-services.component";
import { PreferencesPatientDetailsComponent } from "./preferences-integration-services/preferences-patient-details/preferences-patient-details.component";
import { PreferencesSiteComponent } from "./preferences-site/preferences-site.component";
import { PreferencesSMSComponent } from "./preferences-sms/preferences-sms.component";
import { PreferencesTemplatesComponent } from "./preferences-templates/preferences-templates.component";
import { PreferencesUsersComponent } from "./preferences-users/preferences-users.component";
import { PreferencesComponent } from "./preferences/preferences.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";
import { ProfileComponent } from "./users/profile/profile.component";
import { UsersPreferencesComponent } from "./users/users-preferences/users-preferences.component";

const routes: Routes = [
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { accesskey: 1 },
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    component: PreferencesComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'site',
        pathMatch: 'full',
      },
      {
        path: 'site',
        component: PreferencesSiteComponent,
        data: { accesskey: 462 },
        canActivate: [AuthGuardService]
      },
      {
        path: 'users',
        component: PreferencesUsersComponent,
        data: {accesskey: 462},
        canActivate: [AuthGuardService]
      },
      {
        path: 'appointments',
        component: PreferencesAppointmentsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'practitioners',
        component: PreferencesAppointmentOwnersComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'patient-details',
        component: PreferencesPatientDetailsComponent,
        data: { accesskey: 2 },
        canActivate: [AuthGuardService]
      },
      {
        path: 'contact',
        component: PreferencesContactsComponent,
        data: { accesskey: 2 },
        canActivate: [AuthGuardService]
      },
      {
        path: 'documents',
        component: PreferencesDocumentsComponent,
        data: { accesskey: 2 },
        canActivate: [AuthGuardService]
      },
      {
        path: 'accounts',
        component: AccountsPreferencesComponent,
        data: { accesskey: 461 },
        canActivate: [AuthGuardService]
      },
      {
        path: 'sms',
        component: PreferencesSMSComponent,
        data: { accesskey: 416 },
        canActivate: [AuthGuardService]
      },
      {
        path: 'templates',
        component: PreferencesTemplatesComponent,
        data: { accesskey: 117 },
        canActivate: [AuthGuardService]
      },
      {
        path: 'users',
        component: UsersPreferencesComponent,
        data: { accesskey: 2 },
        canActivate: [AuthGuardService]
      },
      {
        path: 'integration-services',
        component: PreferencesIntegrationServicesComponent,
        data: { accesskey: 1 },
        canActivate: [AuthGuardService]
      },      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferencesRoutingModule { }
