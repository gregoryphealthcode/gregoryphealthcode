import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxPopupModule, DxButtonModule, DxSelectBoxModule } from 'devextreme-angular';
import { AccountsPaymentTrackingComponent } from './accounts-payment-tracking.component';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from "src/app/shared/directives/directives.module";
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaymentTrackingViewModule } from 'src/app/shared/components/payment-tracking-view/payment-tracking-view.module';

@NgModule({
  declarations: [AccountsPaymentTrackingComponent],
  imports: [
    FormsModule,
    CommonModule,
    DxDataGridModule,
    DxPopupModule,
    DxButtonModule,
    NoDataModule,
    MatButtonModule,
    DirectivesModule,
    PaymentTrackingViewModule,
    AppButtonModule,
    DxSelectBoxModule,
    GridSearchTextBoxModule,
    MatTooltipModule,
  ],
  providers: [],
  exports: [AccountsPaymentTrackingComponent],
})

export class AccountsPaymentTrackingModule { }
