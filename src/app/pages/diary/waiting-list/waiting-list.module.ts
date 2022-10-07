import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
  DxDataGridModule, DxButtonModule, DxValidationSummaryModule, DxSelectBoxModule, DxTextAreaModule, DxCheckBoxModule,
  DxPopupModule, DxTextBoxModule, DxContextMenuModule, DxLoadPanelModule, DxSwitchModule, DxDateBoxModule,
} from "devextreme-angular";
import { WaitingListAllComponent } from "./waiting-list.component";
import { MatButtonModule } from "@angular/material/button";
import { NewPatientDetailsModule } from "../../patient-details/new-patient-details/new-patient-details.module";
import { NoDataModule } from "src/app/shared/components/no-data/no-data.module";
import { UserAvatarModule } from "src/app/shared/components/user-avatar/user-avatar.module";
import { AddEditAppointmentPopupModule } from "src/app/shared/components/add-edit-appointment-popup/add-edit-appointment-popup.module";
import { MatIconModule } from "@angular/material/icon";
import { PatientDetailsQuickViewModule } from "src/app/shared/components/patient-details-quick-view/patient-details-quick-view.module";
import { PopUpFormModule } from "src/app/shared/components/pop-up-form/pop-up-form.module";
import { AppFormModule } from "src/app/shared/components/app-form/app-form.module";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { GridSearchTextBoxModule } from "src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module";
import { AppPageWrapperModule } from "src/app/shared/components/app-page-wrapper/app-page-wrapper.module";
import { AppCardModule } from "src/app/shared/widgets/app-card/app-card.module";
import { PatientQuickSearchModule } from "src/app/shared/components/patients/patient-quick-search/patient-quick-search.module";
import { AppointmentsControlModule } from "src/app/shared/components/appointments/appointments.module";
import { WaitingListGridModule } from "src/app/shared/components/waiting-list/waiting-list-grid.module";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxValidationSummaryModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxCheckBoxModule,
    DxPopupModule,
    DxTextBoxModule,
    DxContextMenuModule,
    DxLoadPanelModule,
    DxSwitchModule,
    MatButtonModule,
    NoDataModule,
    UserAvatarModule,
    MatButtonModule,
    MatIconModule,
    PatientDetailsQuickViewModule,
    PopUpFormModule,
    ReactiveFormsModule,
    AppButtonModule,
    AppFormModule,
    DirectivesModule,
    GridSearchTextBoxModule,
    AppPageWrapperModule,
    AppButtonModule,
    AppCardModule,
    DxDateBoxModule,
    WaitingListGridModule
  ],
  declarations: [WaitingListAllComponent],
  exports: [WaitingListAllComponent],
})

export class WaitingListModule { }