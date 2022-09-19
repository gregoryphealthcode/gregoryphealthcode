import { NgModule } from '@angular/core';
import { DxBoxModule, DxFormModule, DxPopupModule, DxButtonModule, DxTabPanelModule,
  DxTemplateModule, DxDropDownBoxModule, DxCheckBoxModule, DxTextBoxModule, DxDropDownButtonModule, DxListModule,
  DxAccordionModule, DxLoadPanelModule, DxPopoverModule, DxSpeedDialActionModule, DxSelectBoxModule, DxLookupModule, DxAutocompleteModule,
  DxNumberBoxModule, DxTextAreaModule, DxDataGridModule, DxToolbarModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PostcodeSelectAddressModule } from 'src/app/shared/components/postcode-select-address/postcode-select-address.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

@NgModule({
    declarations: [],
    imports: [
      DxBoxModule, DxFormModule, DxPopupModule, DxButtonModule, DxTabPanelModule, DxTemplateModule, DxDropDownBoxModule, DxButtonModule,
      DxCheckBoxModule, DxTextBoxModule, DxDropDownButtonModule,
      DxListModule, DxAccordionModule, DxLoadPanelModule, CommonModule,
      DxPopoverModule, DxSpeedDialActionModule,
      DxSelectBoxModule, DxLookupModule, DxAutocompleteModule, DxNumberBoxModule, DxTextAreaModule, DxPopupModule,
      DxDataGridModule, DxToolbarModule,PostcodeSelectAddressModule,
      DxAutocompleteModule, ReactiveFormsModule, MatIconModule, MatButtonModule,
      DirectivesModule,
    ],
    exports: []
  })

  export class MedSecPreferencesIntegrationServicesModule { }
