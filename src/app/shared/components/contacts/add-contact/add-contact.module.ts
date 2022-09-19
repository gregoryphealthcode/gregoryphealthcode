import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxTextBoxModule, DxFormModule, DxAccordionModule, DxButtonModule, DxSelectBoxModule, DxCheckBoxModule, DxDataGridModule, DxValidatorModule, DxValidationSummaryModule, DxNumberBoxModule, DxPopupModule, DxAutocompleteModule, DxTextAreaModule } from "devextreme-angular";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { NoDataModule } from "../../no-data/no-data.module";
import { PopUpFormModule } from "../../pop-up-form/pop-up-form.module";
import { PostcodeSelectAddressModule } from "../../postcode-select-address/postcode-select-address.module";
import { PostcodeToAddressModule } from "../../postcode-to-address/postcode-to-address.module";
import { ContactTelecomEditModule } from "../contact-telecom-edit/contact-telecom-edit.module";
import { AddContactComponent } from "./add-contact.component";

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
    DxNumberBoxModule,
    DxPopupModule,
    PostcodeSelectAddressModule,
    DxAutocompleteModule,
    DxValidatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    PostcodeToAddressModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    ContactTelecomEditModule,
    MatTabsModule,
    NoDataModule,
    MatMenuModule,
    DxTextAreaModule,
    PopUpFormModule,
    AppButtonModule,
    AppFormModule,
  ],
  declarations: [
    AddContactComponent,
  ],
  exports: [
    AddContactComponent
  ]
})

export class AddContactModule { }