import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PatientAddEditPopupComponent } from "./patient-add-edit-popup.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxDataGridModule, DxPopupModule } from "devextreme-angular";
import { DirectivesModule } from "../../directives/directives.module";
import { AppButtonModule } from "../../widgets/app-button/app-button.module";
import { AppFormModule } from "../app-form/app-form.module";
import { ViewDiaryModule } from "../diary/view-diary.module";
import { PopUpFormModule } from "../pop-up-form/pop-up-form.module";
import { DuplicatePatientPopupComponent } from "./duplicate-patient-popup/duplicate-patient-popup.component";
import { NewPatientConnectionsComponent } from "./new-patient-connections/new-patient-connections.component";
import { NewPatientInsurersComponent } from "./new-patient-insurers/new-patient-insurers.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { PatientInsurersEditModule } from "src/app/pages/patient-details/patient-insurers-edit/patient-insurers-edit.module";
import { ContactListModule } from "../contacts/contacts-list.module";
import { PostcodeToAddressModule } from "../postcode-to-address/postcode-to-address.module";
import { ContactsGridModule } from "../contacts/contacts-grid/contacts-grid.module";
import { AddContactModule } from "../contacts/add-contact/add-contact.module";
import { ContactAddToPatientModule } from "../contacts/contact-add-to-patient/contact-add-to-patient.module";

@NgModule({
  declarations: [PatientAddEditPopupComponent, DuplicatePatientPopupComponent, NewPatientConnectionsComponent, NewPatientInsurersComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    PopUpFormModule,
    AppFormModule,
    FormsModule,
    ReactiveFormsModule,
    ViewDiaryModule,
    DxDataGridModule,
    DirectivesModule,
    MatTooltipModule,
    AppButtonModule,
    MatMenuModule,
    DxPopupModule,
    MatIconModule,
    PatientInsurersEditModule,
    ContactListModule,
    PostcodeToAddressModule,
    DirectivesModule,
    ContactsGridModule,
    AddContactModule,
    ContactAddToPatientModule,
  ],
  exports: [PatientAddEditPopupComponent, DuplicatePatientPopupComponent, NewPatientConnectionsComponent, NewPatientInsurersComponent]
})
export class PatientAddEditPopupModule {}
