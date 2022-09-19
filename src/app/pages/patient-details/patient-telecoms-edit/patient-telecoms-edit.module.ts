import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PatientTelecomsEditComponent } from './patient-telecoms-edit.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { DxTextBoxModule, DxAutocompleteModule, DxSelectBoxModule } from 'devextreme-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';

@NgModule({
  declarations: [PatientTelecomsEditComponent],
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
    DxAutocompleteModule,
    DxTextBoxModule,
    MatTooltipModule,
    DxSelectBoxModule,
    AppButtonModule,
    AppFormModule
  ],
  exports: [PatientTelecomsEditComponent],
  providers: []


})
export class PatientTelecomsEditModule { }
