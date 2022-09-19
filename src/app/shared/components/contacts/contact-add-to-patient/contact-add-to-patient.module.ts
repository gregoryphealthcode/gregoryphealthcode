import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxTextBoxModule, DxAutocompleteModule, DxCheckBoxModule, DxSelectBoxModule, DxPopupModule } from "devextreme-angular";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { AppFormModule } from "../../app-form/app-form.module";
import { PostcodeToAddressModule } from "../../postcode-to-address/postcode-to-address.module";
import { ContactAddToPatientComponent } from "./contact-add-to-patient.component";
import { ContactAddToPatientBtnComponent } from './contact-add-to-patient-btn/contact-add-to-patient-btn.component';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { PopUpFormModule } from "../../pop-up-form/pop-up-form.module";
import { MatMenuModule } from "@angular/material/menu";
import { ContactsGridModule } from "../contacts-grid/contacts-grid.module";
import { AddContactModule } from "../add-contact/add-contact.module";

@NgModule({
  imports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatIconModule,
      PostcodeToAddressModule,
      MatTooltipModule,
      MatFormFieldModule,
      MatSelectModule,
      MatCheckboxModule,
      MatInputModule,
      DxTextBoxModule,
      DxAutocompleteModule,
      AppButtonModule,
      DxCheckBoxModule,
      DxSelectBoxModule,
      AppFormModule,
      MatSlideToggleModule,
      DxPopupModule,
      DxSelectBoxModule,
      DirectivesModule,
      AppButtonModule,
      PopUpFormModule,
      MatMenuModule,
      ContactsGridModule,
      AddContactModule
  ],
  declarations: [
      ContactAddToPatientComponent,
      ContactAddToPatientBtnComponent
  ],
  exports: [
    ContactAddToPatientComponent,
    ContactAddToPatientBtnComponent
  ]})

  export class ContactAddToPatientModule {}
