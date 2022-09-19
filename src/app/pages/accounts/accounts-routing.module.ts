import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/guards/auth.guard';
import { AccountsCodeSearchComponent } from './accounts-code-search/accounts-code-search.component';
import { AccountsRemittancesComponent } from './accounts-remittances/accounts-remittances.component';
import { AccountsGuidelinePricingComponent } from './accounts-guideline-pricing/accounts-guideline-pricing.component';
import { AccountsBulkPaymentsComponent } from './accounts-bulk-payments/accounts-bulk-payments.component';
import { AccountsCreditControlComponent } from './accounts-credit-control/accounts-credit-control.component';
import { AccountsPaymentTrackingComponent } from './accounts-payment-tracking/accounts-payment-tracking.component';
import { BillingListComponent } from './billing/billing-list.component';
import { InvoiceComponent } from './invoice-add-edit/invoice.component';
import { AccountsInvoicesComponent } from './accounts-invoices/accounts-invoices.component';
import { BulkPaymentViewComponent } from './bulk-payment-view/bulk-payment-view/bulk-payment-view.component';
import { InvoiceAutoPopComponent } from './invoice-auto-pop/invoice-auto-pop.component';


const routes: Routes = [
  {
    path: 'billing-list',
    component: BillingListComponent ,
    data: {accesskey: 1},
    canActivate: [AuthGuardService]
  },
  {
    path: 'invoice/:patientid',
    component: InvoiceComponent ,
    data: {accesskey: 1},
    canActivate: [AuthGuardService]
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
    data: {accesskey: 1},
    canActivate: [AuthGuardService]
  },
  {
    path: 'pending-invoices',
    component: AccountsInvoicesComponent,
    data: {accesskey: 1},
    canActivate: [AuthGuardService]
  },
  {
    path: 'review-invoice#review',
    component: InvoiceComponent,
    data: {accesskey: 1},
    canActivate: [AuthGuardService]
  },
  {
    path: 'invoices-for-review',
    data: {accesskey: 1},
    component: AccountsInvoicesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'code-search',
    component: AccountsCodeSearchComponent,
    data: {accesskey: 207},
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'remittances',
    component: AccountsRemittancesComponent,
    data: {accesskey: 210},
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'invoice-autopop',
    component: InvoiceAutoPopComponent,
    data: {accesskey: 1},
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'pricing-matrix',
    component: AccountsGuidelinePricingComponent,
    data: {accesskey: 216},
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'bulk-payments',
    component: AccountsBulkPaymentsComponent,
    data: {accesskey: 210},
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'bulk-payments/:bulkPaymentId',
    component: BulkPaymentViewComponent,
    data: {accesskey: 210},
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'credit-control',
    component: AccountsCreditControlComponent,
    data: {accesskey: 213},
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'payment-tracking',
    component: AccountsPaymentTrackingComponent,
    data: {accesskey: 212},
    canActivate: [ AuthGuardService ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
