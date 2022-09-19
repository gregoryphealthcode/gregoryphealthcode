import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPayorsSelectComponent } from './patient-payors-select/patient-payors-select.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxContextMenuModule, DxPopupModule, DxScrollViewModule, DxSelectBoxModule, DxTextBoxModule, DxTooltipModule } from 'devextreme-angular';
import { PatientInsurersEditModule } from 'src/app/pages/patient-details/patient-insurers-edit/patient-insurers-edit.module';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { AppFormModule } from '../app-form/app-form.module';
import { ContactListModule } from '../contacts/contacts-list.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { RelatedPersonsEditModule } from '../related-persons/related-persons-edit.module';
import { PayorDetailsEditComponent } from './payor-details-edit/payor-details-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostcodeToAddressModule } from '../postcode-to-address/postcode-to-address.module';
import { DirectivesModule } from '../../directives/directives.module';
import { PatientPayorSelectDropdownComponent } from './patient-payor-select-dropdown/patient-payor-select-dropdown.component';
import { MatMenuModule } from '@angular/material/menu';
import { AddPayorLogicComponent } from './add-payor-logic/add-payor-logic.component';
import { AddContactModule } from '../contacts/add-contact/add-contact.module';
import { ContactsGridModule } from '../contacts/contacts-grid/contacts-grid.module';
import { ContactAddToPatientModule } from '../contacts/contact-add-to-patient/contact-add-to-patient.module';

@NgModule({
  declarations: [PatientPayorsSelectComponent, PayorDetailsEditComponent, PatientPayorSelectDropdownComponent, AddPayorLogicComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    DxPopupModule,
    ContactListModule,
    PatientInsurersEditModule,
    PopUpFormModule,
    AppFormModule,
    AppButtonModule,
    RelatedPersonsEditModule,
    MatTooltipModule,
    PostcodeToAddressModule,
    DirectivesModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    MatMenuModule,
    DxTooltipModule,
    AddContactModule,
    DxContextMenuModule,
    DxTextBoxModule,
    ContactsGridModule,
    ContactAddToPatientModule,
  ],
  exports:[PatientPayorsSelectComponent, PayorDetailsEditComponent, PatientPayorSelectDropdownComponent, AddPayorLogicComponent]
})
export class PatientPayorsSelectModule { }
