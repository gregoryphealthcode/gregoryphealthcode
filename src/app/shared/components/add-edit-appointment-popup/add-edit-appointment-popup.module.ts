import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditAppointmentPopupComponent } from './add-edit-appointment-popup.component';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { AddAppointmentModule } from '../add-appointment/add-appointment.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PatientQuickSearchModule } from '../patients/patient-quick-search/patient-quick-search.module';

@NgModule({
  declarations: [AddEditAppointmentPopupComponent],
  imports: [
    CommonModule,
    PopUpFormModule,
    DxPopupModule,
    AddAppointmentModule,
    MatButtonModule,
    MatIconModule,
    PatientQuickSearchModule
  ],
  exports: [AddEditAppointmentPopupComponent]
})
export class AddEditAppointmentPopupModule { }
