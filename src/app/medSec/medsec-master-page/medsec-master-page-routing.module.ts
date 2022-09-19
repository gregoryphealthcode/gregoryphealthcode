import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsBulkPaymentsComponent } from 'src/app/pages/accounts/accounts-bulk-payments/accounts-bulk-payments.component';
import { AccountsCreditControlComponent } from 'src/app/pages/accounts/accounts-credit-control/accounts-credit-control.component';
import { AccountsPaymentTrackingComponent } from 'src/app/pages/accounts/accounts-payment-tracking/accounts-payment-tracking.component';
import { InvoiceComponent } from 'src/app/pages/accounts/invoice-add-edit/invoice.component';
import { NewPatientSearchComponent } from 'src/app/pages/new-patient-search/new-patient-search.component';
import { TasksGridComponent } from 'src/app/pages/tasks/tasks-grid/tasks-grid.component';
import { ListContactsComponent } from 'src/app/shared/components/contacts/contacts-list.component';
import { MedSecAuthGuardService } from 'src/app/shared/guards/medsec-auth.guard';
import { MedsecDiaryViewComponent } from '../diary/medsec-diary-view/medsec-diary-view.component';


const routes: Routes = [
  {
    path: 'patient-list',
    component: NewPatientSearchComponent,
    data: {accesskey: 1},
    canActivate: [MedSecAuthGuardService]
  },
  {
    path: 'diary-view',
    component: MedsecDiaryViewComponent,
    data: {accesskey: 1},
    canActivate: [MedSecAuthGuardService]
  },
  {
    path: 'accounts/credit-control',
    component: AccountsCreditControlComponent,
    data: { accesskey: 1 },
    canActivate: [MedSecAuthGuardService]
  },
  {
    path: 'accounts/payment-tracking',
    component: AccountsPaymentTrackingComponent,
    data: { accesskey: 1 },
    canActivate: [MedSecAuthGuardService]
  },
  {
    path: 'accounts/bulk-payments',
    component: AccountsBulkPaymentsComponent,
    data: { accesskey: 1 },
    canActivate: [MedSecAuthGuardService]
  },
  {
    path: 'contacts/list-contacts',
    component: ListContactsComponent,
    data: {accesskey: 1},
    canActivate: [MedSecAuthGuardService]
  },
  {
    path: 'tasks/tasks-grid',
    component: TasksGridComponent,
    data: {accesskey: 1},
    canActivate: [MedSecAuthGuardService]
  },
  {
    path: 'accounts/invoice',
    component: InvoiceComponent,
    data: {accesskey: 1},
    canActivate: [MedSecAuthGuardService]
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MedSecMasterPageRoutingModule {

}
