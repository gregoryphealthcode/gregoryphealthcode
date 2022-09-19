import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxDataGridModule, DxHtmlEditorModule, DxPopupModule, } from "devextreme-angular";
import { AppFormModule } from "src/app/shared/components/app-form/app-form.module";
import { PopUpFormModule } from "src/app/shared/components/pop-up-form/pop-up-form.module";
import { UserAvatarModule } from "src/app/shared/components/user-avatar/user-avatar.module";
import { PatientCorrespondencePreviewModule } from "../patient-correspondence-preview/patient-correspondence-preview.module";
import { PatientLifestyleModule } from "../patient-lifestyle/patient-lifestyle.module";
import { PatientSummaryComponent } from "./patient-summary.component";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { PatientPopupWarningNotesModule } from "../patient-popup-warning-notes/patient-popup-warning-notes.component";
import { PatientLettersAddEditModule } from "../patient-communications/patient-letters/patient-letters-add-edit/patient-letters-add-edit.module";
import { AppointmentPopupAddEditModule } from "src/app/shared/components/appointment-popup-add-edit/appointment-popup-add-edit.module";


@NgModule({
  declarations: [PatientSummaryComponent],
  imports: [
    FormsModule,
    CommonModule,
    PatientLifestyleModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    DxDataGridModule,
    DxPopupModule,
    PopUpFormModule,
    PatientCorrespondencePreviewModule,
    DxHtmlEditorModule,
    UserAvatarModule,
    AppFormModule,
    DirectivesModule,
    AppButtonModule,
    PatientPopupWarningNotesModule,
    PatientLettersAddEditModule,
    AppointmentPopupAddEditModule
  ],
  exports: [PatientSummaryComponent],
  providers: [],
})

export class PatientSummaryModule { }