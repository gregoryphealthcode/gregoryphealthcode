import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { BulkPaymentsReallocationComponent } from './bulk-payments-reallocation.component';
import { MatButtonModule } from '@angular/material/button';
import { PatientAddressModule } from 'src/app/pages/patient-details/patient-address/patient-address.module';
import { PatientTelecomsModule } from 'src/app/pages/patient-details/patient-telecoms/patient-telecoms.module';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceErrorSectionModule } from 'src/app/pages/accounts/invoice-add-edit/invoice-error-section/invoice-error-section.module';

@NgModule({
  declarations: [BulkPaymentsReallocationComponent],
  imports: [
    FormsModule,
    CommonModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    MatButtonModule,
    PatientAddressModule,
    PatientTelecomsModule,
    MatIconModule,
    InvoiceErrorSectionModule

  ],
  providers: [],
  exports: [BulkPaymentsReallocationComponent],
})

export class BulkPaymentsReallocationModule {
}
