import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientLettersAddEditComponent } from './patient-letters-add-edit.component';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { DxDataGridModule, DxPopupModule, DxFileUploaderModule } from 'devextreme-angular';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  declarations: [PatientLettersAddEditComponent],
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
  ],
  exports: [PatientLettersAddEditComponent],
})
export class PatientLettersAddEditModule { }
