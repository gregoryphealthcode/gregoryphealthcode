import { NgModule } from '@angular/core';
import {
  DxDataGridModule, DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule,
  DxFormModule, DxSwitchModule, DxToolbarModule, DxPopupModule, DxTabPanelModule, DxSelectBoxModule,
  DxTextAreaModule, DxNumberBoxModule, DxDateBoxModule, DxTextBoxModule, DxAutocompleteModule, DxAccordionModule, DxValidationSummaryModule, DxValidatorModule
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { RelatedPersonsEditComponent } from './related-persons-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostcodeToAddressModule } from '../postcode-to-address/postcode-to-address.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { DirectivesModule } from '../../directives/directives.module';
import { AppFormModule } from '../app-form/app-form.module';
import { AppButtonModule } from '../../widgets/app-button/app-button.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ContactTelecomEditModule } from '../contacts/contact-telecom-edit/contact-telecom-edit.module';
import { NoDataModule } from '../no-data/no-data.module';
import { PopUpFormModule } from '../pop-up-form/pop-up-form.module';
import { PostcodeSelectAddressModule } from '../postcode-select-address/postcode-select-address.module';

@NgModule({
  declarations: [RelatedPersonsEditComponent],
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
  exports: [RelatedPersonsEditComponent]
})

export class RelatedPersonsEditModule { }
