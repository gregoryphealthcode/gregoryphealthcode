import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DiaryViewModule } from 'src/app/pages/diary-view/diary-view.module';
import { NewPatientSearchModule } from 'src/app/pages/new-patient-search/new-patient-search.module';
import { AppointmentPopupAddEditModule } from 'src/app/shared/components/appointment-popup-add-edit/appointment-popup-add-edit.module';
import { ContactListModule } from 'src/app/shared/components/contacts/contacts-list.module';
import { ViewDiaryModule } from 'src/app/shared/components/diary/view-diary.module';
import { MasterPageLayoutModule } from 'src/app/shared/components/master-page-layout/master-page-layout.module';
import { PinRequiredModule } from 'src/app/shared/components/pin-required-modal/pin-required.module';
import { MedsecDiaryViewComponent } from '../diary/medsec-diary-view/medsec-diary-view.component';
import { MedSecMasterPageRoutingModule } from './medsec-master-page-routing.module';
import { MedSecMasterPageComponent } from './medsec-master-page.component';

@NgModule({
  declarations: [
    MedSecMasterPageComponent,
    MedsecDiaryViewComponent],
  imports: [
    CommonModule,
    RouterModule,
    PinRequiredModule,
    FormsModule,
    NewPatientSearchModule,
    MasterPageLayoutModule,
    ViewDiaryModule,
    ContactListModule,
    DiaryViewModule,
    AppointmentPopupAddEditModule
  ],
  exports:[
    MedSecMasterPageRoutingModule
  ]
})
export class MedSecMasterPageModule { }
