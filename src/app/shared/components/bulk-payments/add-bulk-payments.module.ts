import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxPopupModule } from 'devextreme-angular';
import { AppFormModule } from '../app-form/app-form.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { AddBulkPaymentFormComponent } from './add-bulk-payment-form.component';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';

@NgModule({
  declarations: [AddBulkPaymentFormComponent],
  imports: [
    FormsModule,
    CommonModule,
    DxPopupModule,
    ReactiveFormsModule,
    AppFormModule,
    PopUpFormModule,
    AppButtonModule
  ],
  providers: [],
  exports: [AddBulkPaymentFormComponent],
})

export class AddBulkPaymentsModule {
}
