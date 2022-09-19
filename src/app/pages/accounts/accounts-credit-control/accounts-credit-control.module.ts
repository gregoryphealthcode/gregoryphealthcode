import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { DxDataGridModule, DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule, DxFormModule, DxSwitchModule, DxToolbarModule, DxPopupModule, DxSelectBoxModule, DxDateBoxModule } from "devextreme-angular";
import { MomentModule } from "ngx-moment";
import { InvoiceSummaryViewModule } from "src/app/shared/components/invoice-summary-view/invoice-summary-view.module";
import { NoDataModule } from "src/app/shared/components/no-data/no-data.module";
import { PatientDetailsQuickViewModule } from "src/app/shared/components/patient-details-quick-view/patient-details-quick-view.module";
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { GridSearchTextBoxModule } from "src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module";
import { AccountsCreditControlComponent } from "./accounts-credit-control.component";
import { AccountsCreditControlGridComponent } from './accounts-credit-control-grid/accounts-credit-control-grid.component';
import { TasksModule } from "../../tasks/tasks.module";
import { MatTabsModule } from "@angular/material/tabs";
import { PaymentTrackingViewModule } from "src/app/shared/components/payment-tracking-view/payment-tracking-view.module";

@NgModule({
    declarations: [AccountsCreditControlComponent, AccountsCreditControlGridComponent],
    imports: [
      DxDataGridModule, 
      DxBoxModule, 
      DxButtonModule, 
      DxContextMenuModule, 
      DxCheckBoxModule,
      CommonModule, 
      DxFormModule, 
      DxSwitchModule, 
      DxToolbarModule, 
      DxDataGridModule,
      DxPopupModule, 
      AppButtonModule,
      MomentModule,
      NoDataModule,
      PatientDetailsQuickViewModule, 
      GridSearchTextBoxModule,      
      InvoiceSummaryViewModule, 
      MatButtonModule, 
      MatIconModule, 
      DirectivesModule, 
      PaymentTrackingViewModule,
      DxSelectBoxModule,
      TasksModule,
      MatTabsModule,
      DxDateBoxModule   
    ],
    exports: [AccountsCreditControlComponent]
  })
  
  export class AccountsCreditControlModule { }
  