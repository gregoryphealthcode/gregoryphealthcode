import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DxBoxModule, DxPopupModule, DxButtonModule,
  DxTabPanelModule, DxTemplateModule, DxDropDownBoxModule,
  DxCheckBoxModule, DxTextBoxModule, DxDropDownButtonModule, DxListModule, DxAccordionModule,
  DxLoadPanelModule, DxPopoverModule, DxSpeedDialActionModule, DxSelectBoxModule, DxLookupModule,
  DxAutocompleteModule, DxNumberBoxModule, DxTextAreaModule, DxValidatorModule, DxValidationGroupModule,
  DxDataGridModule } from 'devextreme-angular';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';
import { CommonModule, } from '@angular/common';
import { PatientAccountsModule } from '../patient-accounts/patient-accounts.component';
import { PatientAppointmentsdModule } from '../patient-appointments/patient-appointments.component';
import { MomentModule } from 'ngx-moment';
import { PostcodeSelectAddressModule } from 'src/app/shared/components/postcode-select-address/postcode-select-address.module';
import { ContactListModule } from 'src/app/shared/components/contacts/contacts-list.module';
import { PatientNotesModule } from '../patient-notes/patient-notes.component';
import { PatientActivityModule } from '../patient-activity/patient-activity.component';
import { PatientPopupWarningNotesModule } from '../patient-popup-warning-notes/patient-popup-warning-notes.component';
import { PatientInsurersModule } from '../patient-insurers/patient-insurers.module';
import { AngularResizedEventModule } from 'angular-resize-event';
import { RelatedPersonsEditModule } from 'src/app/shared/components/related-persons/related-persons-edit.module';
import { NewPatientDetailsComponent } from './new-patient-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { PatientPersonalInfoModule } from '../patient-personal-info/patient-personal-info.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PatientTelecomsModule } from '../patient-telecoms/patient-telecoms.module';
import { PatientConnectionsModule } from '../patient-connections/patient-connections.module';
import { PatientRelatedPersonModule } from '../patient-related-persons/patient-related-persons.module';
import { PatientLifestyleModule } from '../patient-lifestyle/patient-lifestyle.module';
import { PatientAddressModule } from '../patient-address/patient-address.module';
import { PatientDetailsEditModule } from '../patient-details-edit/patient-details-edit.module';
import { UserAvatarModule } from 'src/app/shared/components/user-avatar/user-avatar.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PatientSummaryModule } from '../patient-summary/patient-summary.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { PatientReferenceNumbersModule } from '../patient-reference-numbers/patient-reference-numbers.module';
import { PatientWaitingListModule } from '../patient-waiting-list/patient-waiting-list.module';
import { PatientCommunicationsModule } from '../patient-communications/patient-communications.module';
import { TasksModule } from '../../tasks/tasks.module';
import { AppointmentPopupAddEditModule } from 'src/app/shared/components/appointment-popup-add-edit/appointment-popup-add-edit.module';

@NgModule({
  declarations: [NewPatientDetailsComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DxBoxModule,
    DxPopupModule,
    DxButtonModule,
    DxTabPanelModule,
    DxTemplateModule,
    DxDropDownBoxModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxDropDownButtonModule,
    PatientSearchModule,
    DxListModule,
    DxAccordionModule,
    DxLoadPanelModule,
    CommonModule,
    PatientAccountsModule,
    PatientAppointmentsdModule,
    MomentModule,
    DxPopoverModule,
    DxSpeedDialActionModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxLookupModule,
    DxAutocompleteModule,
    DxNumberBoxModule,
    DxTextAreaModule,
    DxPopupModule,
    PostcodeSelectAddressModule,
    ContactListModule,
    PatientNotesModule,
    PatientActivityModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxDataGridModule,
    PatientPopupWarningNotesModule,
    PatientInsurersModule,
    AngularResizedEventModule,
    RelatedPersonsEditModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    PatientPersonalInfoModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    PatientTelecomsModule,
    PatientConnectionsModule,
    PatientRelatedPersonModule,
    PatientLifestyleModule,
    PatientAddressModule,
    PatientDetailsEditModule,
    UserAvatarModule,
    MatTooltipModule,
    PatientSummaryModule,
    PopUpFormModule,
    PatientReferenceNumbersModule,
    PatientCommunicationsModule,
    PatientWaitingListModule,
    TasksModule,
    AppointmentPopupAddEditModule
  ],
  exports: [NewPatientDetailsComponent],
  providers: []
})

export class NewPatientDetailsModule { }