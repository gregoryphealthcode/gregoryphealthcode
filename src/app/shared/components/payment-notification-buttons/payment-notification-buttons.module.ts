import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentNotificationReallocateFormComponent } from './payment-notification-reallocate-form/payment-notification-reallocate-form.component';
import { RecordPaymentFormComponent } from './record-payment-form/record-payment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxPopupModule } from 'devextreme-angular';
import { DirectivesModule } from '../../directives/directives.module';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { AppFormModule } from '../app-form/app-form.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { PatientPayorsSelectModule } from '../patient-payors-select/patient-payors-select.module';



@NgModule({
  declarations: [PaymentNotificationReallocateFormComponent, RecordPaymentFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    AppButtonModule,
      AppFormModule,
      DxPopupModule,
      DirectivesModule,
      PopUpFormModule,
      PatientPayorsSelectModule
  ],
  exports: [PaymentNotificationReallocateFormComponent, RecordPaymentFormComponent]
})
export class PaymentNotificationButtonsModule { }
