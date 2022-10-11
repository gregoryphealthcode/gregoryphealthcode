import { NgModule } from '@angular/core';
import { DxSchedulerModule, DxTextBoxModule, DxButtonModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewAppointmentsComponent } from './view-appointments/view-appointments.component';
import { ViewDiaryModule } from 'src/app/shared/components/diary/view-diary.module';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';
import { AddEditAppointmentPopupModule } from 'src/app/shared/components/add-edit-appointment-popup/add-edit-appointment-popup.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DxSchedulerModule,
    DxTextBoxModule,
    DxButtonModule,
    DxPopupModule,
    PatientSearchModule,
    DxSelectBoxModule,
    ViewDiaryModule,
    AddEditAppointmentPopupModule
  ],
  declarations: [
    ViewAppointmentsComponent
  ],
  exports: [

  ]  
})

export class AppointmentsModule { }