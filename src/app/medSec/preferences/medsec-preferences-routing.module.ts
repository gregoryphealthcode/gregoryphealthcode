import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedSecAuthGuardService } from 'src/app/shared/guards/medsec-auth.guard';
import { MedSecPreferencesIntegrationServicesComponent } from './preferences-integration-services/preferences-integration-services.component';


const routes: Routes = [
  {
    path: 'preferences-integration-services',
    component: MedSecPreferencesIntegrationServicesComponent ,
    data: {accesskey: 1},
    canActivate: [MedSecAuthGuardService]
  },
  // {
  //   path: 'add-contact',
  //   component: AddContactComponent ,
  //   data: {accesskey: 1},
  //   canActivate: [MedSecAuthGuardService]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedSecPreferencesRoutingModule { }
