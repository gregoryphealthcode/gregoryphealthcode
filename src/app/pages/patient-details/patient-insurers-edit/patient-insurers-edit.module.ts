import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import {
  DxDataGridModule, DxButtonModule,
  DxPopupModule, DxTextBoxModule, DxCheckBoxModule, DxSelectBoxModule, DxDateBoxModule
} from 'devextreme-angular';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';
import { ViewDiaryModule } from 'src/app/shared/components/diary/view-diary.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PatientInsurersEditComponent } from './patient-insurers-edit.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    DxTextBoxModule,
    PatientSearchModule,
    ViewDiaryModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxDateBoxModule,
    MatIconModule,
    MatButtonModule,
    DirectivesModule,
    AppFormModule,
    AppButtonModule,
    MatTooltipModule
  ],
  declarations: [
    PatientInsurersEditComponent
  ],
  exports: [
    PatientInsurersEditComponent
  ],
  providers: [DatePipe]
})

export class PatientInsurersEditModule { }
