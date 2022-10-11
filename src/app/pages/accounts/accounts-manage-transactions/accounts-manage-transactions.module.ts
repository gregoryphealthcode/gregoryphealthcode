import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxPopupModule, DxButtonModule } from 'devextreme-angular';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { MatButtonModule } from '@angular/material/button';
import { CreditControlTransactionModule } from 'src/app/shared/components/credit-control-transactions/credit-control-transactions.module';
import { AccountsManageTransactionsComponent } from './accounts-manage-transactions.component';

@NgModule({
  declarations: [AccountsManageTransactionsComponent],
  imports: [
    FormsModule,
    CommonModule,
     DxDataGridModule,
     DxPopupModule,
     DxButtonModule,
     NoDataModule,
     MatButtonModule,
     CreditControlTransactionModule
    ],
  providers: [],
  exports: [],
})

export class AccountsManageTransactionsModule { }
