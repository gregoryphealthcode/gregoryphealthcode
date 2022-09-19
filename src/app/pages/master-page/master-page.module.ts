import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DxDataGridModule, DxFormModule, DxButtonModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { LocationSessionsModule } from '../sessions/location-sessions.module';
import { ContactsModule } from '../contacts/contacts.module';
import { ContactDetailsModule } from 'src/app/shared/components/contacts/contact-details.module';
import { AccessNotAllowedModule } from '../redirects/access-not-allowed/access-not-allowed.component';
import { PaymentAgeBandsEditModule } from 'src/app/shared/components/payment-age-bands-edit/payment-age-bands-edit.module';
import { RelatedPersonsEditModule } from 'src/app/shared/components/related-persons/related-persons-edit.module';
import { AddBulkPaymentsModule } from 'src/app/shared/components/bulk-payments/add-bulk-payments.module';
import { MasterPageComponent } from './master-page.component';
import { MasterPageRoutingModule } from './master-page-routing.module';
import { SingleCardModule } from 'src/app/layouts';
import { DxCommonFormControlsModule } from 'src/app/shared/modules/dx-common/dx-common-form-controls.module';
import { NewPatientDetailsModule } from '../patient-details/new-patient-details/new-patient-details.module';
import { NewPatientSearchModule } from '../new-patient-search/new-patient-search.module';
import { InvoiceModule } from '../accounts/invoice-add-edit/invoice.module';
import { MasterPageLayoutModule } from 'src/app/shared/components/master-page-layout/master-page-layout.module';
import { UserPanelModule } from 'src/app/shared/components';
import { SitePanelModule } from 'src/app/shared/components/site-panel/site-panel.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DiaryViewModule } from '../diary-view/diary-view.module';

@NgModule({
  declarations: [
    MasterPageComponent],
  imports: [
    CommonModule,
    DxCommonFormControlsModule,
    RouterModule,
    DxDataGridModule,
    DxFormModule,
    FormsModule,
    DxButtonModule,
    NewPatientDetailsModule,
    LocationSessionsModule,
    ContactsModule,
    ContactDetailsModule,
    AccessNotAllowedModule,
    InvoiceModule,
    PaymentAgeBandsEditModule,
    RelatedPersonsEditModule,
    AddBulkPaymentsModule,
    SingleCardModule,
    NewPatientSearchModule,
    MasterPageLayoutModule,
    DxButtonModule,
    UserPanelModule,
    SitePanelModule,
    MatIconModule,
    DxButtonModule,
    MatButtonModule,
    MatIconModule,
    DiaryViewModule
  ],
  exports:[
    MasterPageRoutingModule
  ]
})
export class MasterPageModule { }
