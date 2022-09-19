import { AccountsBulkPaymentsComponent } from './accounts-bulk-payments.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxPopupModule, DxButtonModule, DxProgressBarModule, DxResizableModule, DxSelectBoxModule } from 'devextreme-angular';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { MatButtonModule } from '@angular/material/button';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AddBulkPaymentsModule } from 'src/app/shared/components/bulk-payments/add-bulk-payments.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { MedSecSiteSelectorModule } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [AccountsBulkPaymentsComponent],
  imports: [
    FormsModule,
    CommonModule,
    DxDataGridModule,
    DxPopupModule,
    DxButtonModule,
    DxProgressBarModule,
    DxResizableModule,
    NoDataModule,
    MatButtonModule,
    DxSelectBoxModule,
    AppButtonModule,
    AddBulkPaymentsModule,
    GridSearchTextBoxModule,
    MedSecSiteSelectorModule,
    MatTooltipModule
  ],
  providers: [],
  exports: [AccountsBulkPaymentsComponent],
})

export class AccountsBulkPaymentsModule { }