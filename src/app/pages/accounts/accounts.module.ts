import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { DxDataGridModule, DxPieChartModule, DxChartModule } from "devextreme-angular";
import { AppFormModule } from "src/app/shared/components/app-form/app-form.module";
import { AppPageWrapperModule } from "src/app/shared/components/app-page-wrapper/app-page-wrapper.module";
import { BulkPaymentsReallocationModule } from "src/app/shared/components/bulk-payments-reallocation/bulk-payments-reallocation.module";
import { NoDataModule } from "src/app/shared/components/no-data/no-data.module";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { AppCardModule } from "src/app/shared/widgets/app-card/app-card.module";
import { GridSearchTextBoxModule } from "src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module";
import { AccountsBillsForReviewModule } from "./accounts-bills-for-review/accounts-bills-for-review.module";
import { AccountsBulkPaymentsModule } from "./accounts-bulk-payments/accounts-bulk-payments.module";
import { AccountsCodeSearchComponent } from "./accounts-code-search/accounts-code-search.component";
import { AccountsCreditControlModule } from "./accounts-credit-control/accounts-credit-control.module";
import { AccountsGuidelinePricingModule } from "./accounts-guideline-pricing/accounts-guideline-pricing.module";
import { AccountsInvoicesModule } from "./accounts-invoices/accounts-invoices.module";
import { AccountsPaymentTrackingModule } from "./accounts-payment-tracking/accounts-payment-tracking.module";
import { AccountsRemittancesComponent } from "./accounts-remittances/accounts-remittances.component";
import { RemittanceViewComponent } from "./accounts-remittances/remittance-view/remittance-view.component";
import { RemittancesHeaderComponent } from "./accounts-remittances/remittances-header/remittances-header.component";
import { AccountsRoutingModule } from "./accounts-routing.module";
import { BillingModule } from "./billing/billing.module";
import { BulkPaymentViewModule } from "./bulk-payment-view/bulk-payment-view.module";
import { InvoiceAutoPopModule } from "./invoice-auto-pop/invoice-auto-pop.module";


@NgModule({
  declarations: [
    AccountsRemittancesComponent,
    AccountsCodeSearchComponent,
    RemittanceViewComponent,
    RemittancesHeaderComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    BillingModule,
    AccountsBillsForReviewModule,
    AccountsCreditControlModule,
    AccountsBulkPaymentsModule,
    AccountsPaymentTrackingModule,
    BulkPaymentsReallocationModule,
    DirectivesModule,
    AccountsGuidelinePricingModule,
    AppPageWrapperModule,
    AppButtonModule,
    AppCardModule,
    DxDataGridModule,
    DxPieChartModule,
    AppFormModule,
    DxChartModule,
    MatCheckboxModule,
    GridSearchTextBoxModule,
    NoDataModule,
    MatTabsModule,
    AccountsInvoicesModule,
    BulkPaymentViewModule,
    InvoiceAutoPopModule,    
  ]
})
export class AccountsModule { }
