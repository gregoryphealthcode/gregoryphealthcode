import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientLettersDocumentsComponent } from './patient-letters-documents.component';
import { PatientDocumentsComponent } from './patient-documents/patient-documents.component';
import { PatientLettersComponent } from './patient-letters/patient-letters.component';
import { PatientDocumentsAddEditComponent } from './patient-documents/patient-documents-add-edit/patient-documents-add-edit.component';
import { PatientLettersAddEditComponent } from './patient-letters/patient-letters-add-edit/patient-letters-add-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DxDataGridModule, DxFileUploaderModule, DxPopupModule } from 'devextreme-angular';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { PatientLettersAddEditModule } from './patient-letters/patient-letters-add-edit/patient-letters-add-edit.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [PatientLettersDocumentsComponent, PatientDocumentsComponent, PatientLettersComponent, PatientDocumentsAddEditComponent],
  imports: [
    CommonModule,
    GridSearchTextBoxModule, 
    AppButtonModule,
    DxDataGridModule,
    PopUpFormModule, 
    DxPopupModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    DxFileUploaderModule,
    AppFormModule,
    MatTabsModule,
    MatCheckboxModule,
    PipesModule, 
    PatientLettersAddEditModule,
    MatTooltipModule,
  ],
  exports: [PatientLettersDocumentsComponent, PatientDocumentsComponent, PatientLettersComponent, PatientDocumentsAddEditComponent],
})
export class PatientLettersDocumentsModule { }
