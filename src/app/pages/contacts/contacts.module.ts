import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    DxTextBoxModule, DxFormModule, DxAccordionModule, DxButtonModule, DxSelectBoxModule, DxCheckBoxModule,
    DxDataGridModule, DxValidatorModule, DxValidationSummaryModule, DxNumberBoxModule, DxPopupModule
} from 'devextreme-angular';
import { ContactDetailsModule } from 'src/app/shared/components/contacts/contact-details.module';
import { ContactListModule } from 'src/app/shared/components/contacts/contacts-list.module';
import { ContactViewComponent } from './contact-view/contact-view.component';
import { ContactViewHeaderComponent } from './contact-view/contact-view-header/contact-view-header.component';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { AppPageWrapperModule } from 'src/app/shared/components/app-page-wrapper/app-page-wrapper.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppCardModule } from 'src/app/shared/widgets/app-card/app-card.module';
import { MatTabsModule } from '@angular/material/tabs';
import { ContactViewAddressesComponent } from './contact-view/contact-view-addresses/contact-view-addresses.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { EditContactAddressModule } from 'src/app/shared/components/contacts/edit-contact-address/edit-contact-address.module';
import { ContactViewTelecomsComponent } from './contact-view/contact-view-telecoms/contact-view-telecoms.component';
import { ContactViewOrganisationsComponent } from './contact-view/contact-view-organisations/contact-view-organisations.component';
import { ContactTelecomEditModule } from 'src/app/shared/components/contacts/contact-telecom-edit/contact-telecom-edit.module';
import { EditContactModule } from 'src/app/shared/components/contacts/edit-contact/edit-contact.module';
import { ContactViewPatientsComponent } from './contact-view/contact-view-patients/contact-view-patients.component';
import { ContactsGridModule } from 'src/app/shared/components/contacts/contacts-grid/contacts-grid.module';
import { PatientDetailsQuickViewModule } from 'src/app/shared/components/patient-details-quick-view/patient-details-quick-view.module';
import { LinkPatientComponent } from './link-patient/link-patient.component';
import { PatientQuickSearchModule } from 'src/app/shared/components/patients/patient-quick-search/patient-quick-search.module';
import { ContactViewDepartmentsComponent } from './contact-view/contact-view-departments/contact-view-departments.component';
import { DepartmentGridModule } from 'src/app/shared/components/contacts/department-grid/department-grid.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddContactModule } from 'src/app/shared/components/contacts/add-contact/add-contact.module';
import { MedSecSiteSelectorModule } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        DxTextBoxModule,
        DxFormModule,
        DxAccordionModule,
        DxButtonModule,
        DxSelectBoxModule,
        DxCheckBoxModule,
        DxDataGridModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxNumberBoxModule, DxPopupModule,
        ContactDetailsModule,
        ContactListModule,
        ContactDetailsModule,
        AppFormModule,
        PopUpFormModule,
        AppPageWrapperModule,
        AppButtonModule,
        AppCardModule,
        MatTabsModule, MatIconModule, MatButtonModule,
        DirectivesModule,
        EditContactAddressModule,
        ContactTelecomEditModule,
        EditContactModule,
        ContactsGridModule,
        PatientDetailsQuickViewModule,
        ReactiveFormsModule,
        PatientQuickSearchModule,
        DepartmentGridModule,
        MatTooltipModule,
        AddContactModule,
        MedSecSiteSelectorModule
    ],
    declarations: [
        ContactViewComponent,
        ContactViewHeaderComponent,
        ContactViewAddressesComponent,
        ContactViewTelecomsComponent,
        ContactViewOrganisationsComponent,
        ContactViewPatientsComponent,
        LinkPatientComponent,
        ContactViewDepartmentsComponent
    ],
    exports: [

    ]
})
export class ContactsModule { }
