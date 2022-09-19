import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { PostcodeSelectAddressModule } from 'src/app/shared/components/postcode-select-address/postcode-select-address.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { DxDataGridModule, DxButtonModule, DxPopupModule, DxTextBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { PatientConnectionsComponent } from './patient-connections.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactDetailsModule } from 'src/app/shared/components/contacts/contact-details.module';
import { ContactsSummaryViewModule } from 'src/app/shared/components/contacts-summary-view/contacts-summary-view.module';
import { MatMenuModule } from '@angular/material/menu';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { ContactsGridModule } from 'src/app/shared/components/contacts/contacts-grid/contacts-grid.module';
import { ContactAddToPatientModule } from 'src/app/shared/components/contacts/contact-add-to-patient/contact-add-to-patient.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
@NgModule({
  declarations: [PatientConnectionsComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MomentModule,
    PostcodeSelectAddressModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    MatTooltipModule,
    ContactDetailsModule,
    ContactsSummaryViewModule,
    MatMenuModule,
    NoDataModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    PopUpFormModule,
    ContactAddToPatientModule,
    DirectivesModule,
    GridSearchTextBoxModule,
    AppButtonModule,
    ContactsGridModule
  ],
  exports: [PatientConnectionsComponent],
  providers: []
})
export class PatientConnectionsModule { }
