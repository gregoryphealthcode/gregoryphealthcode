import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DxDataGridModule, DxButtonModule, DxPopupModule, DxTextBoxModule, DxCheckBoxModule, DxSelectBoxModule, DxDateBoxModule, DxRadioGroupModule } from 'devextreme-angular';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { ViewDiaryModule } from 'src/app/shared/components/diary/view-diary.module';
import { MasterPageLayoutModule } from 'src/app/shared/components/master-page-layout/master-page-layout.module';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppCardModule } from 'src/app/shared/widgets/app-card/app-card.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { PatientInsurersEditModule } from '../../../../pages/patient-details/patient-insurers-edit/patient-insurers-edit.module';
import { PatientTasksAddEditComponent } from './patient-tasks-add-edit.component';

@NgModule({
  declarations: [PatientTasksAddEditComponent],
  imports: [
    FormsModule,
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
    PatientInsurersEditModule,
    MatTooltipModule,
    PopUpFormModule,
    DirectivesModule,
    AppFormModule,
    AppButtonModule,
    GridSearchTextBoxModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MasterPageLayoutModule,
    MatTabsModule,
    DxRadioGroupModule,
    AppCardModule,
  ],
  exports: [PatientTasksAddEditComponent]
})
export class PatientTasksAddEditModule { }
