import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PatientRelatedPersonsComponent } from './patient-related-persons.component';
import { DxPopupModule, DxDataGridModule } from 'devextreme-angular';
import { RelatedPersonsEditModule } from 'src/app/shared/components/related-persons/related-persons-edit.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { RelatedPersonSummaryModule } from 'src/app/shared/components/related-person-summary/related-person-summary.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  declarations: [PatientRelatedPersonsComponent],
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
    DxPopupModule,
    DxDataGridModule,
    RelatedPersonsEditModule,
    MatTooltipModule,
    NoDataModule,
    RelatedPersonSummaryModule,
    DirectivesModule,
    PopUpFormModule,
    GridSearchTextBoxModule,    
    AppButtonModule,
  ],
  exports: [PatientRelatedPersonsComponent],
  providers: []
})

export class PatientRelatedPersonModule { }