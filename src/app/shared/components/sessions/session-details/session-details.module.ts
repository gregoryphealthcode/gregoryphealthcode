import { NgModule } from "@angular/core";
import { SessionDetailsComponent } from "./session-details.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DxAutocompleteModule, DxCheckBoxModule, DxDateBoxModule, DxLoadIndicatorModule, DxSelectBoxModule, DxTagBoxModule, DxTextBoxModule, DxToastModule } from "devextreme-angular";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDateAdapter, NgbDateNativeAdapter, } from "@ng-bootstrap/ng-bootstrap";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { AppFormModule } from "../../app-form/app-form.module";
// ** PG ** import { NgxRruleModule } from "ngx-rrule";

// import pkg from 'ngx-rrule';
// const { RRule } = pkg;

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    // ** PG ** NgxRruleModule,
    MatButtonModule,
    MatIconModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxDateBoxModule,
    DxAutocompleteModule,
    MatTooltipModule,
    DxSelectBoxModule,
    DxTagBoxModule,
    AppFormModule,
    AppButtonModule,
    DxToastModule,
    DxLoadIndicatorModule
   ],
  declarations: [SessionDetailsComponent],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
  ],
  exports: [SessionDetailsComponent]
})

export class SessionDetailsModule { }
