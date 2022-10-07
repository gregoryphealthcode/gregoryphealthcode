import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxAutocompleteModule, DxCheckBoxModule, DxSelectBoxModule, DxTextAreaModule, DxTextBoxModule } from "devextreme-angular";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AddCorrespondenceTemplateComponent } from "./templates-correspondence-add.component";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DirectivesModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxAutocompleteModule,
    DxCheckBoxModule,
    DxSelectBoxModule
  ],
  declarations: [
    AddCorrespondenceTemplateComponent
  ],
  exports: [
    AddCorrespondenceTemplateComponent
  ]
})

export class AddCorrespondenceTemplateModule { }
