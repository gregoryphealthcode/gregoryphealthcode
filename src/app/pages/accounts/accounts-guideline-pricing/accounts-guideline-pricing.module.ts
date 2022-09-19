import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DxDataGridModule, DxScrollViewModule, DxButtonModule, DxPopupModule, DxSelectBoxModule, DxTextBoxModule, DxTagBoxModule } from "devextreme-angular";
import { DxiColumnModule } from "devextreme-angular/ui/nested";
import { AppFormModule } from "src/app/shared/components/app-form/app-form.module";
import { PopUpFormModule } from "src/app/shared/components/pop-up-form/pop-up-form.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { GridSearchTextBoxModule } from "src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module";
import { AccountsGuidelinePricingAddPayorComponent } from "./accounts-guideline-pricing-add-payor/accounts-guideline-pricing-add-payor.component";
import { AccountsGuidelinePricingAddServiceComponent } from "./accounts-guideline-pricing-add-service/accounts-guideline-pricing-add-service.component";
import { AccountsGuidelinePricingComponent } from "./accounts-guideline-pricing.component";
import { ServicePricingGridComponent } from "./service-pricing-grid/service-pricing-grid.component";
import { AccountsGuidelinePricingMultipleProceduresComponent } from './accounts-guideline-pricing-multiple-procedures/accounts-guideline-pricing-multiple-procedures.component';
import { AccountsGuidelinePricingEditComponent } from './accounts-guideline-pricing-edit/accounts-guideline-pricing-edit.component';

@NgModule({
  declarations: [AccountsGuidelinePricingComponent,
    AccountsGuidelinePricingAddServiceComponent,
    AccountsGuidelinePricingAddPayorComponent,
    ServicePricingGridComponent,
    AccountsGuidelinePricingMultipleProceduresComponent,
    AccountsGuidelinePricingEditComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    AppButtonModule,
    DxDataGridModule,
    DxScrollViewModule,
    DxiColumnModule,
    DxButtonModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    GridSearchTextBoxModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    PopUpFormModule,
    FormsModule,
    AppFormModule,
    DxTagBoxModule
  ],
  exports: [AccountsGuidelinePricingComponent,
    AccountsGuidelinePricingAddServiceComponent,
    AccountsGuidelinePricingAddPayorComponent,
    ServicePricingGridComponent],
})

export class AccountsGuidelinePricingModule { }