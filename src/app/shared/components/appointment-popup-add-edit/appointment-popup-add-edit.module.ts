import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxContextMenuModule, DxDataGridModule, DxDateBoxModule, DxPopupModule, DxRadioGroupModule } from "devextreme-angular";
import { AppButtonModule } from "../../widgets/app-button/app-button.module";
import { GridSearchTextBoxModule } from "../../widgets/grid-search-text-box/grid-search-text-box.module";
import { AppFormModule } from "../app-form/app-form.module";
import { ViewDiaryModule } from "../diary/view-diary.module";
import { InvoiceServicesSelectModule } from "../invoice-services-select/invoice-services-select.module";
import { MedSecSiteSelectorModule } from "../med-sec-site-selector/med-sec-site-selector.module";
import { PatientPayorsSelectModule } from "../patient-payors-select/patient-payors-select.module";
import { PatientQuickSearchModule } from "../patients/patient-quick-search/patient-quick-search.module";
import { PopUpFormModule } from "../pop-up-form/pop-up-form.module";
import { WaitingListAddEditModule } from "../waiting-list-add-edit/waiting-list-add-edit.module";
import { AppointmentPopupAddEditComponent } from "./appointment-popup-add-edit.component";
import { AppointmentPopupInstructionsAddEditComponent } from "./appointment-popup-instructions-add-edit/appointment-popup-instructions-add-edit.component";


@NgModule({
  declarations: [AppointmentPopupAddEditComponent, AppointmentPopupInstructionsAddEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    DxContextMenuModule,
    AppButtonModule,
    MatMenuModule,
    MedSecSiteSelectorModule,
    ViewDiaryModule,
    DxDataGridModule,
    GridSearchTextBoxModule,
    DxDateBoxModule,
    WaitingListAddEditModule,
    ReactiveFormsModule,
    PopUpFormModule,
    DxPopupModule,
    AppFormModule,
    PatientQuickSearchModule,
    PatientPayorsSelectModule,
    DxRadioGroupModule,
    InvoiceServicesSelectModule,
  ],
  exports: [AppointmentPopupAddEditComponent]
})
export class AppointmentPopupAddEditModule { }
