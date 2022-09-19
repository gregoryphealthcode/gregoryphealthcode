import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PatientDetailsEditComponent } from './patient-details-edit.component';
import { CommonModule } from '@angular/common';
import * as _moment from 'moment';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { DxTextBoxModule, DxAutocompleteModule, DxSelectBoxModule, DxDateBoxModule, DxCheckBoxModule, DxPopupModule, DxDataGridModule, DxTextAreaModule } from 'devextreme-angular';
import { PostcodeSelectAddressModule } from 'src/app/shared/components/postcode-select-address/postcode-select-address.module';
import { PostcodeToAddressModule } from 'src/app/shared/components/postcode-to-address/postcode-to-address.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';

@NgModule({
  declarations: [PatientDetailsEditComponent],
  imports: [
    FormsModule,
    CommonModule,
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
    DirectivesModule,
    DxTextBoxModule,
    DxAutocompleteModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxCheckBoxModule,
    PostcodeSelectAddressModule,
    PostcodeToAddressModule,
    DxPopupModule,
    DxDataGridModule,
    DxTextAreaModule,
    AppButtonModule,
    AppFormModule,
    DxSelectBoxModule
  ],
  exports: [PatientDetailsEditComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },]

})
export class PatientDetailsEditModule { }

