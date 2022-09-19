import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientAddressEditBtnComponent } from './patient-address-edit-btn.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from '../../app-form/app-form.module';
import { DxPopupModule } from 'devextreme-angular';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';
import { PostcodeToAddressModule } from '../../postcode-to-address/postcode-to-address.module';

@NgModule({
  declarations: [PatientAddressEditBtnComponent],
  imports: [
    CommonModule,    
    AppFormModule,
    DxPopupModule,
    PopUpFormModule,
    FormsModule,
    AppButtonModule,
    ReactiveFormsModule,
    DirectivesModule,
    PostcodeToAddressModule
  ],
  exports: [PatientAddressEditBtnComponent],
})
export class PatientAddressEditBtnModule { }
