import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientAllergiesComponent } from './patient-allergies.component';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { PatientAllergiesAddEditModule } from './patient-allergies-add-edit/patient-allergies-add-edit.module';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxScrollViewModule } from 'devextreme-angular';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { DxiColumnModule } from 'devextreme-angular/ui/nested';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [PatientAllergiesComponent],
  imports: [
    CommonModule,
    AppFormModule,
    AppButtonModule,
    PatientAllergiesAddEditModule,
    DxDataGridModule,
    DxScrollViewModule,
    DxiColumnModule,
    DxButtonModule,
    DxPopupModule,
    GridSearchTextBoxModule,
    MatTooltipModule,
  ],
  exports: [PatientAllergiesComponent],
})
export class PatientAllergiesModule { }
