import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientSmsSendBtnComponent } from './patient-sms-send-btn.component';
import { DxPopupModule } from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppFormModule } from '../../app-form/app-form.module';
import { PopUpFormModule } from '../../pop-up-form/pop-up-form.module';

@NgModule({
  declarations: [PatientSmsSendBtnComponent],
  imports: [
    CommonModule,    
    AppFormModule,
    DxPopupModule,
    PopUpFormModule,
    FormsModule,
    AppButtonModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  exports: [PatientSmsSendBtnComponent],
})
export class PatientSmsSendBtnModule { }
