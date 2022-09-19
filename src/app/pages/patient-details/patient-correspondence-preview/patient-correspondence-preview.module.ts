import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AppFormModule } from "src/app/shared/components/app-form/app-form.module";
import { PopUpFormModule } from "src/app/shared/components/pop-up-form/pop-up-form.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { PatientCorrespondencePreviewComponent } from "./patient-correspondence-preview.component";

@NgModule({
  declarations: [PatientCorrespondencePreviewComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    AppFormModule,
    AppButtonModule,
    PopUpFormModule

  ],
  exports: [PatientCorrespondencePreviewComponent],
  providers: []
})
export class PatientCorrespondencePreviewModule { }
