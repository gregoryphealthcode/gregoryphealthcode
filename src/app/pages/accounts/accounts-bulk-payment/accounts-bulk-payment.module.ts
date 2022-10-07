import { NgModule } from '@angular/core';
import { AccountsBulkPaymentComponent } from './accounts-bulk-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
   DxDataGridModule, DxPopupModule, DxButtonModule, DxDateBoxModule, DxNumberBoxModule,
   DxSelectBoxModule, DxTabPanelModule, DxTextAreaModule, DxTextBoxModule, DxPieChartModule
} from 'devextreme-angular';
import { AppPageWrapperModule } from 'src/app/shared/components/app-page-wrapper/app-page-wrapper.module';
import { BulkPaymentDetailsComponent } from './bulk-payment-details/bulk-payment-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { BulkPaymentsReallocationModule } from 'src/app/shared/components/bulk-payments-reallocation/bulk-payments-reallocation.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { OutstandingInvoicesComponent } from './outstanding-invoices/outstanding-invoices.component';
import { PaymentAllocationsComponent } from './payment-allocations/payment-allocations.component';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppCardModule } from 'src/app/shared/widgets/app-card/app-card.module';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';
import { ShortFallsComponent } from './short-falls/short-falls.component';

@NgModule({
   declarations: [AccountsBulkPaymentComponent, BulkPaymentDetailsComponent, OutstandingInvoicesComponent, PaymentAllocationsComponent, PaymentSummaryComponent, ShortFallsComponent],
   imports: [
      FormsModule,
      CommonModule,
      DxDataGridModule,
      DxPopupModule,
      DxButtonModule,
      DxTextAreaModule,
      DxDateBoxModule,
      DxSelectBoxModule,
      DxTextBoxModule,
      DxNumberBoxModule,
      ReactiveFormsModule,
      DxTabPanelModule,
      BulkPaymentsReallocationModule,
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
      MatTabsModule,
      AppFormModule,
      PopUpFormModule,
      AppPageWrapperModule,
      AppButtonModule,
      AppCardModule,
      DxPieChartModule
   ],
   providers: [],
   exports: [],
})

export class AccountsAddBulkPaymentsModule { }
