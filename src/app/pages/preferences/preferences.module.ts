import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { DxAutocompleteModule, DxButtonModule, DxCheckBoxModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxLoadPanelModule, DxDropDownBoxModule, DxDataGridModule, DxBoxModule, DxResponsiveBoxModule, DxFormModule, DxListModule, DxPopupModule, DxFileUploaderModule, DxToolbarModule, DxTemplateModule, DxDateBoxModule, DxRadioGroupModule, DxContextMenuModule, DxNumberBoxModule, DxSelectBoxModule, DxScrollViewModule, DxTextAreaModule, DxTabPanelModule, DxDropDownButtonModule, DxAccordionModule, DxPopoverModule, DxSpeedDialActionModule, DxLookupModule, DxSortableModule, DxColorBoxModule } from "devextreme-angular";
import { DxiColumnModule } from "devextreme-angular/ui/nested";
import { ImageCropperModule } from "ngx-image-cropper";
import { AppFormModule } from "src/app/shared/components/app-form/app-form.module";
import { AppointmentLocationComponent } from "src/app/shared/components/appointment-location/appointment-location.component";
import { NoDataModule } from "src/app/shared/components/no-data/no-data.module";
import { PatientSearchModule } from "src/app/shared/components/patient-search/patient-search.component";
import { PaymentAgeBandsEditModule } from "src/app/shared/components/payment-age-bands-edit/payment-age-bands-edit.module";
import { PopUpFormModule } from "src/app/shared/components/pop-up-form/pop-up-form.module";
import { PostcodeSelectAddressModule } from "src/app/shared/components/postcode-select-address/postcode-select-address.module";
import { PostcodeToAddressModule } from "src/app/shared/components/postcode-to-address/postcode-to-address.module";
import { PreferencesContactDetailsModule } from "src/app/shared/components/preferences/contact-details/contact-details.module";
import { OtherPreferencesModule } from "src/app/shared/components/preferences/other-preferences/other-preferences.module";
import { ReferenceNumbersModule } from "src/app/shared/components/preferences/reference-numbers/reference-numbers.module";
import { SiteAccountsModule } from "src/app/shared/components/preferences/site-accounts/site-accounts.module";
import { SiteAddressModule } from "src/app/shared/components/preferences/site-address/site-address.module";
import { SiteDetailsModule } from "src/app/shared/components/preferences/site-details/site-details.module";
import { SiteDocumentsModule } from "src/app/shared/components/preferences/site-documents/site-documents.module";
import { SiteHealthcodeModule } from "src/app/shared/components/preferences/site-healthcode/site-healthcode.module";
import { SitePatientZoneModule } from "src/app/shared/components/preferences/site-patient-zone/site-patient-zone.module";
import { SitePayeeProvidersModule } from "src/app/shared/components/preferences/site-payee-providers/site-payee-providers.module";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { AppInfoService } from "src/app/shared/services";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { GridSearchTextBoxModule } from "src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module";
import { PatientAllergiesAddEditModule } from "../patient-details/patient-allergies/patient-allergies-add-edit/patient-allergies-add-edit.module";
import { PatientPersonalInfoModule } from "../patient-details/patient-personal-info/patient-personal-info.module";
import { AccountsPreferencesComponent } from "./accounts/accounts-preferences/accounts-preferences.component";
import { AccountsReminderTimescalesComponent } from "./accounts/accounts-reminder-timescales/accounts-reminder-timescales.component";
import { PaymentAgeBandsComponent } from "./accounts/payment-age/payment-age-bands.component";
import { PreferencesInvoicingComponent } from "./accounts/preferences-invoicing/preferences-invoicing.component";
import { AppointmentTypeAddEditComponent } from "./preferences-appointments/preferences-appointment-types/appointment-type-add-edit/appointment-type-add-edit.component";
import { ContactTelecomTypeAddEditComponent } from "./preferences-contact-telecoms/contact-telecom-type-add-edit/contact-telecom-type-add-edit.component";
import { PreferencesContactTelecomsComponent } from "./preferences-contact-telecoms/preferences-contact-telecoms.component";
import { ContactTypeAddEditComponent } from "./preferences-contact-types/contact-type-add-edit/contact-type-add-edit.component";
import { PreferencesContactTypesComponent } from "./preferences-contact-types/preferences-contact-types.component";
import { PreferencesContactsComponent } from "./preferences-contacts/preferences-contacts.component";
import { DocumentTypesAddEditComponent } from "./preferences-document-types/document-types-add-edit/document-types-add-edit.component";
import { PreferencesDocumentTypesComponent } from "./preferences-document-types/preferences-document-types.component";
import { PreferencesDocumentsComponent } from "./preferences-documents/preferences-documents.component";
import { PreferencesIntegrationServicesComponent } from "./preferences-integration-services/preferences-integration-services.component";
import { PreferencesIntegrationServicesModule } from "./preferences-integration-services/preferences-integration-services.module";
import { PreferencesPatientDetailsComponent } from "./preferences-integration-services/preferences-patient-details/preferences-patient-details.component";
import { PatientDocumentTypesAddEditComponent } from "./preferences-patient-document-types/patient-document-types-add-edit/patient-document-types-add-edit.component";
import { PreferencesPatientDocumentTypesComponent } from "./preferences-patient-document-types/preferences-patient-document-types.component";
import { PreferencesRoutingModule } from "./preferences-routing.module";
import { PreferencesSiteComponent } from "./preferences-site/preferences-site.component";
import { PreferencesSMSComponent } from "./preferences-sms/preferences-sms.component";
import { PreferencesUsersComponent } from "./preferences-users/preferences-users.component";
import { PreferencesComponent } from "./preferences/preferences.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";
import { PreferencesUserSecurityComponent } from "./users/preferences-user-security/preferences-user-security.component";
import { ProfileComponent } from "./users/profile/profile.component";
import { UsersPreferencesComponent } from "./users/users-preferences/users-preferences.component";
import { PreferencesAppointmentInstructionsComponent } from './preferences-appointments/preferences-appointment-instructions/preferences-appointment-instructions.component';
import { PreferencesAppointmentInstructionsAddEditComponent } from './preferences-appointments/preferences-appointment-instructions/preferences-appointment-instructions-add-edit/preferences-appointment-instructions-add-edit.component';
import { PreferencesTemplatesModule } from "./preferences-templates/preferences-templates.module";
import { PreferencesEdiAddressAddEditComponent } from './accounts/preferences-edi/preferences-edi-address-add-edit/preferences-edi-address-add-edit.component';
import { PreferencesEdiAddressComponent } from "./accounts/preferences-edi/preferences-edi-address.component";
import { PreferencesAppointmentsComponent } from './preferences-appointments/preferences-appointments.component';
import { PreferencesAppointmentLocationsAddEditComponent } from './preferences-appointments/preferences-appointment-locations/preferences-appointment-locations-add-edit/preferences-appointment-locations-add-edit.component';
import { PreferencesAppointmentSessionsComponent } from './preferences-appointments/preferences-appointment-sessions/preferences-appointment-sessions.component';
import { PreferencesAppointmentSessionsAddEditComponent } from './preferences-appointments/preferences-appointment-sessions/preferences-appointment-sessions-add-edit/preferences-appointment-sessions-add-edit.component';
import { PreferencesAppointmentTypesComponent } from "./preferences-appointments/preferences-appointment-types/preferences-appointment-types.component";
import { PreferencesAppointmentLocationsComponent } from "./preferences-appointments/preferences-appointment-locations/preferences-appointment-locations.component";
import { PreferencesAppointmentDiaryComponent } from './preferences-appointments/preferences-appointment-diary/preferences-appointment-diary.component';

@NgModule({
  declarations: [
    PreferencesSiteComponent,
    PreferencesPatientDetailsComponent,
    PreferencesAppointmentTypesComponent,
    PaymentAgeBandsComponent,
    AccountsReminderTimescalesComponent,
    PreferencesInvoicingComponent,
    PreferencesSMSComponent,
    ChangePasswordComponent,
    ProfileComponent,
    PreferencesUserSecurityComponent,
    PreferencesUsersComponent,
    PreferencesIntegrationServicesComponent,
    PreferencesContactTelecomsComponent,
    PreferencesComponent,
    AccountsPreferencesComponent,
    UsersPreferencesComponent,
    AppointmentTypeAddEditComponent,
    ContactTelecomTypeAddEditComponent,
    AppointmentLocationComponent,
    PreferencesContactTypesComponent,
    ContactTypeAddEditComponent,
    PreferencesContactsComponent,
    DocumentTypesAddEditComponent,
    PatientDocumentTypesAddEditComponent,
    PreferencesDocumentsComponent,
    PreferencesDocumentTypesComponent,
    PreferencesPatientDocumentTypesComponent,
    PreferencesAppointmentInstructionsComponent,
    PreferencesAppointmentInstructionsAddEditComponent,
    PreferencesEdiAddressAddEditComponent,
    PreferencesEdiAddressComponent,
    PreferencesAppointmentsComponent,
    PreferencesAppointmentLocationsAddEditComponent,
    PreferencesAppointmentSessionsComponent,
    PreferencesAppointmentSessionsAddEditComponent,
    PreferencesAppointmentLocationsComponent,
    PreferencesAppointmentDiaryComponent,
  ],
  imports: [
    PostcodeToAddressModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PreferencesRoutingModule,
    RouterModule,
    DxAutocompleteModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxLoadPanelModule,
    DxDropDownBoxModule,
    DxDataGridModule,
    PipesModule,
    DxBoxModule,
    DxResponsiveBoxModule,
    DxFormModule,
    DxListModule,
    PatientSearchModule,
    DxPopupModule,
    DxBoxModule,
    DxFileUploaderModule,
    ImageCropperModule,
    DxToolbarModule,
    DxTemplateModule,
    PostcodeSelectAddressModule,
    DxDateBoxModule,
    DxRadioGroupModule,
    DxContextMenuModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxScrollViewModule,
    DxTextAreaModule,
    DxTabPanelModule,
    DxDropDownButtonModule,
    DxAccordionModule,
    DxPopoverModule,
    DxSpeedDialActionModule,
    DxLookupModule,
    DxSortableModule,
    PatientPersonalInfoModule,
    PaymentAgeBandsEditModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatTooltipModule,
    DirectivesModule,
    ReferenceNumbersModule,
    PreferencesContactDetailsModule,
    OtherPreferencesModule,
    NoDataModule,
    PopUpFormModule,
    AppButtonModule,
    AppFormModule,
    DxSelectBoxModule,
    PreferencesIntegrationServicesModule,
    DxColorBoxModule,
    GridSearchTextBoxModule,
    PatientAllergiesAddEditModule,
    DxiColumnModule,
    DxButtonModule,
    DxPopupModule,
    SiteDetailsModule,
    SiteAddressModule,
    SiteDocumentsModule,
    SitePatientZoneModule,
    SiteAccountsModule,
    SiteHealthcodeModule,
    SitePayeeProvidersModule,
    PreferencesTemplatesModule
  ],
  providers: [AppInfoService],
  exports: [PreferencesRoutingModule,
  ]
})

export class PreferencesModule { }
