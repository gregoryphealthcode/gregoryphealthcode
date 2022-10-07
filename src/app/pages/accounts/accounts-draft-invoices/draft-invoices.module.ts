import { NgModule } from '@angular/core';
import { DraftInvoicesComponent } from './draft-invoices.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  DxDataGridModule, DxPopupModule, DxButtonModule, DxProgressBarModule, DxResizableModule, DxScrollViewModule, DxContextMenuModule } from 'devextreme-angular';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { PatientDetailsQuickViewModule } from 'src/app/shared/components/patient-details-quick-view/patient-details-quick-view.module';
import { InvoiceSummaryViewModule } from 'src/app/shared/components/invoice-summary-view/invoice-summary-view.module';
import { BillingListSummaryViewModule } from 'src/app/shared/components/billing-list-summary-view/billing-list-summary-view.module';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  declarations: [DraftInvoicesComponent],
  imports: [
    FormsModule,
    CommonModule,
    DxDataGridModule,
    DxPopupModule,
    DxButtonModule,
    DxProgressBarModule,
    DxResizableModule,
    DxScrollViewModule,
    DxContextMenuModule,
    NoDataModule,
    PatientDetailsQuickViewModule,
    InvoiceSummaryViewModule,
    DirectivesModule,
    BillingListSummaryViewModule,
    GridSearchTextBoxModule,
    AppButtonModule
  ],
  providers: [],
  exports: [DraftInvoicesComponent],
})

export class DraftInvoicesModule { }