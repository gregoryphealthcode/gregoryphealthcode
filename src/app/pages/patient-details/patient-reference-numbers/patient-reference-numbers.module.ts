import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { PatientReferenceNumbersComponent } from './patient-reference-numbers.component';
import { DxDataGridModule, DxPopupModule, DxAutocompleteModule, DxTextBoxModule } from 'devextreme-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { PatientReferenceNumbersAddEditComponent } from './patient-reference-numbers-add-edit/patient-reference-numbers-add-edit.component';

@NgModule({
  declarations: [PatientReferenceNumbersComponent, PatientReferenceNumbersAddEditComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatExpansionModule,
    DxDataGridModule,
    DxPopupModule,
    MatTooltipModule,
    DirectivesModule,
    DxAutocompleteModule,
    DxTextBoxModule,
    PopUpFormModule,
    AppFormModule,
    AppButtonModule,
  ],
  exports: [PatientReferenceNumbersComponent],
  providers: []
})
export class PatientReferenceNumbersModule { }
