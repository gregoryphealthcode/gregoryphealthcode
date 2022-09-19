import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  DxCheckBoxModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from "devextreme-angular";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppFormModule } from "../../app-form/app-form.module";
import { ReferenceNumbersComponent } from "./reference-numbers.component";
import { ReferenceNumbersAddEditComponent } from "./reference-numbers-add-edit/reference-numbers-add-edit.component";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { PopUpFormModule } from "../../pop-up-form/pop-up-form.module";
import { GridSearchTextBoxModule } from "src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module";

@NgModule({
  imports: [
    DxTextBoxModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DirectivesModule,
    DxDataGridModule,
    MatIconModule,
    MatButtonModule,
    DxCheckBoxModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDialogModule,
    AppFormModule,
    AppButtonModule,
    PopUpFormModule,
    DxPopupModule,
    GridSearchTextBoxModule
  ],
  declarations: [ReferenceNumbersComponent, ReferenceNumbersAddEditComponent],
  exports: [ReferenceNumbersComponent],
})
export class ReferenceNumbersModule {}
