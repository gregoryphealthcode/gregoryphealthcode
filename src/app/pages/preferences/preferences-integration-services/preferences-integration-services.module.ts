import { NgModule } from '@angular/core';
import {
  DxBoxModule, DxFormModule, DxPopupModule, DxButtonModule, DxTabPanelModule,
  DxTemplateModule, DxDropDownBoxModule, DxCheckBoxModule, DxTextBoxModule, DxDropDownButtonModule, DxListModule,
  DxAccordionModule, DxLoadPanelModule, DxPopoverModule, DxSpeedDialActionModule, DxSelectBoxModule, DxLookupModule, DxAutocompleteModule,
  DxNumberBoxModule, DxTextAreaModule, DxDataGridModule, DxToolbarModule, DxRadioGroupModule
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PostcodeSelectAddressModule } from 'src/app/shared/components/postcode-select-address/postcode-select-address.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PatientzoneRegistrationComponent } from './patientzone-registration/patientzone-registration.component';
import { PatientzoneEditDetailsComponent } from './patientzone-edit-details/patientzone-edit-details.component';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PostcodeToAddressModule } from 'src/app/shared/components/postcode-to-address/postcode-to-address.module';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PatientZoneRegisterPractitionerModule } from './patientzone-register-practitioner/patientzone-register-practitioner.module';
import { PatientZoneErrorSectionModule } from 'src/app/shared/components/patientzone-error-section/patientzone-error-section.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [PatientzoneRegistrationComponent,
    PatientzoneEditDetailsComponent],
  imports: [
    DxBoxModule, DxFormModule, DxPopupModule, DxButtonModule, DxTabPanelModule, DxTemplateModule, DxDropDownBoxModule, DxButtonModule,
    DxCheckBoxModule, DxTextBoxModule, DxDropDownButtonModule,
    DxListModule, DxAccordionModule, DxLoadPanelModule, CommonModule,
    DxPopoverModule, DxSpeedDialActionModule,
    DxSelectBoxModule, DxLookupModule, DxAutocompleteModule, DxNumberBoxModule, DxTextAreaModule, DxPopupModule,
    DxDataGridModule, DxToolbarModule, PostcodeSelectAddressModule,
    DxAutocompleteModule, ReactiveFormsModule, MatIconModule, MatButtonModule,
    DirectivesModule, AppButtonModule, PostcodeToAddressModule,
    PopUpFormModule,
    DxRadioGroupModule, MatCheckboxModule,

    AppFormModule, DxCheckBoxModule, PatientZoneRegisterPractitionerModule, PatientZoneErrorSectionModule, MatTooltipModule
  ],
  exports: [PatientzoneRegistrationComponent,
    PatientzoneEditDetailsComponent]
})

export class PreferencesIntegrationServicesModule { }
