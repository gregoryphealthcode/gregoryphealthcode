import { NgModule } from '@angular/core';
import { PatientAccountsInvoiceItemsComponent } from './patient-accounts-invoice-items.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxDataGridModule
  ],
  declarations: [
    PatientAccountsInvoiceItemsComponent
  ],
  exports: [
    PatientAccountsInvoiceItemsComponent
  ]
})

export class PatientAccountsInvoiceItemsModule { }
