import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DxDataGridModule } from 'devextreme-angular';
import { PatientAccountsTransactionsComponent } from './patient-accounts-transactions.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxDataGridModule
  ],
  declarations: [
    PatientAccountsTransactionsComponent
  ],
  exports: [
    PatientAccountsTransactionsComponent
  ]
})

export class PatientAccountsTransactionsModule { }
