import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxBoxModule, DxButtonModule, DxCheckBoxModule, DxContextMenuModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxFormModule, DxListModule, DxNumberBoxModule, DxPopupModule, DxProgressBarModule, DxRadioGroupModule, DxResizableModule, DxResponsiveBoxModule, DxScrollViewModule, DxSelectBoxModule, DxSwitchModule, DxTabPanelModule, DxTextAreaModule, DxTextBoxModule, DxToolbarModule } from "devextreme-angular";
import { PopUpFormModule } from "src/app/shared/components/pop-up-form/pop-up-form.module";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { GridSearchTextBoxModule } from "src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module";
import { TasksRoutingModule } from "./task-routing.module";
import { TasksComponent } from "./tasks.component";
import { TasksGridComponent } from './tasks-grid/tasks-grid.component';
import { TasksAddEditComponent } from './tasks-add-edit/tasks-add-edit.component';
import { PatientSearchModule } from "src/app/shared/components/patient-search/patient-search.component";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import { AppFormModule } from "src/app/shared/components/app-form/app-form.module";
import { ViewDiaryModule } from "src/app/shared/components/diary/view-diary.module";
import { MasterPageLayoutModule } from "src/app/shared/components/master-page-layout/master-page-layout.module";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppCardModule } from "src/app/shared/widgets/app-card/app-card.module";
import { PatientInsurersEditModule } from "../patient-details/patient-insurers-edit/patient-insurers-edit.module";
import { PatientPayorsSelectModule } from "src/app/shared/components/patient-payors-select/patient-payors-select.module";
import { PatientQuickSearchModule } from "src/app/shared/components/patients/patient-quick-search/patient-quick-search.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MedSecSiteSelectorModule } from "src/app/shared/components/med-sec-site-selector/med-sec-site-selector.module";


@NgModule({
  declarations: [
    TasksComponent,
    TasksGridComponent,
    TasksAddEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DxBoxModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxContextMenuModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxDropDownBoxModule,
    DxFormModule,
    DxListModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxProgressBarModule,
    DxResizableModule,
    DxResponsiveBoxModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    DxSwitchModule,
    DxTabPanelModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxToolbarModule,
    PipesModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    PopUpFormModule,
    AppButtonModule,
    GridSearchTextBoxModule,
    PatientSearchModule,
    ViewDiaryModule,
    PatientInsurersEditModule,
    DirectivesModule,
    AppFormModule,
    RouterModule,
    MasterPageLayoutModule,
    MatTabsModule,
    DxRadioGroupModule,
    AppCardModule,
    PatientPayorsSelectModule,
    PatientQuickSearchModule, 
    MatCheckboxModule,
    MedSecSiteSelectorModule 
  ],
  exports: [
    TasksComponent, TasksRoutingModule, TasksGridComponent
  ]
})
export class TasksModule { }
