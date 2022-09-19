import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxDataGridModule, DxPopupModule, DxButtonModule, DxProgressBarModule, DxResizableModule, DxSelectBoxModule } from "devextreme-angular";
import { AddBulkPaymentsModule } from "src/app/shared/components/bulk-payments/add-bulk-payments.module";
import { InvoiceSummaryViewModule } from "src/app/shared/components/invoice-summary-view/invoice-summary-view.module";
import { MedSecSiteSelectorModule } from "src/app/shared/components/med-sec-site-selector/med-sec-site-selector.module";
import { NoDataModule } from "src/app/shared/components/no-data/no-data.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { GridSearchTextBoxModule } from "src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module";
import { AccountInvoicesGridComponent } from "./account-invoices-grid/account-invoices-grid.component";
import { AccountsInvoicesComponent } from "./accounts-invoices.component";


@NgModule({
  declarations: [AccountsInvoicesComponent, AccountInvoicesGridComponent],
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
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    InvoiceSummaryViewModule
  ],
  exports: [AccountsInvoicesComponent, AccountInvoicesGridComponent],
})
export class AccountsInvoicesModule { } 
