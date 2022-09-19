import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DxTextBoxModule } from "devextreme-angular";
import { AppButtonModule } from "../../widgets/app-button/app-button.module";
import { BillingListSummaryViewComponent } from "./billing-list-summary-view.component";

@NgModule({
  declarations: [BillingListSummaryViewComponent],
  imports: [
    FormsModule,
    CommonModule,
    AppButtonModule,
    DxTextBoxModule
  ],
  providers: [],
  exports: [BillingListSummaryViewComponent],
})

export class BillingListSummaryViewModule {
}
