import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxBoxModule, DxFormModule, DxPopupModule, DxButtonModule, DxTabPanelModule, DxTemplateModule, DxDropDownBoxModule, DxCheckBoxModule, DxTextBoxModule, DxDropDownButtonModule, DxListModule, DxAccordionModule, DxLoadPanelModule, DxPopoverModule, DxSpeedDialActionModule, DxSelectBoxModule, DxLookupModule, DxAutocompleteModule, DxNumberBoxModule, DxTextAreaModule, DxDataGridModule, DxToolbarModule, DxRadioGroupModule } from "devextreme-angular";
import { AppFormModule } from "src/app/shared/components/app-form/app-form.module";
import { PopUpFormModule } from "src/app/shared/components/pop-up-form/pop-up-form.module";
import { PostcodeSelectAddressModule } from "src/app/shared/components/postcode-select-address/postcode-select-address.module";
import { PostcodeToAddressModule } from "src/app/shared/components/postcode-to-address/postcode-to-address.module";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { PatientZoneBankDetailsComponent } from "./patient-zone-bank-details.component";

@NgModule({
  declarations: [PatientZoneBankDetailsComponent
  ],
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

    AppFormModule, DxNumberBoxModule, MatTooltipModule
  ],
  exports: [PatientZoneBankDetailsComponent
  ]
})

export class PatientZoneBankDetailsModule { }
