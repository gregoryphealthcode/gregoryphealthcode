import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkPaymentViewComponent } from './bulk-payment-view/bulk-payment-view.component';
import { BulkPaymentAllocationsComponent } from './bulk-payment-allocations/bulk-payment-allocations.component';
import { BulkPaymentHeaderComponent } from './bulk-payment-header/bulk-payment-header.component';
import { BulkPaymentOutstandingComponent } from './bulk-payment-outstanding/bulk-payment-outstanding.component';
import { BulkPaymentShortfallsComponent } from './bulk-payment-shortfalls/bulk-payment-shortfalls.component';
import { BulkPaymentSummaryComponent } from './bulk-payment-summary/bulk-payment-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxDataGridModule, DxPopupModule, DxButtonModule, DxTextAreaModule, DxDateBoxModule, DxSelectBoxModule, DxTextBoxModule, DxNumberBoxModule, DxTabPanelModule, DxPieChartModule, DxFormModule, DxAccordionModule, DxCheckBoxModule, DxValidatorModule, DxValidationSummaryModule } from 'devextreme-angular';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { AppPageWrapperModule } from 'src/app/shared/components/app-page-wrapper/app-page-wrapper.module';
import { BulkPaymentsReallocationModule } from 'src/app/shared/components/bulk-payments-reallocation/bulk-payments-reallocation.module';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { AppCardModule } from 'src/app/shared/widgets/app-card/app-card.module';
import { BulkPaymentShortfallReallocationComponent } from './bulk-payment-shortfalls/bulk-payment-shortfall-reallocation/bulk-payment-shortfall-reallocation.component';
import { PostcodeToAddressModule } from 'src/app/shared/components/postcode-to-address/postcode-to-address.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { PdfPreviewPopupModule } from 'src/app/shared/components/pdf-preview-popup/pdf-preview-popup.module';



@NgModule({
  declarations: [
    BulkPaymentViewComponent, 
    BulkPaymentAllocationsComponent, 
    BulkPaymentHeaderComponent, 
    BulkPaymentOutstandingComponent, 
    BulkPaymentShortfallsComponent, 
    BulkPaymentSummaryComponent, BulkPaymentShortfallReallocationComponent],
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
    DxPieChartModule,
    DxFormModule,
    DxAccordionModule,
    DxCheckBoxModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DirectivesModule,
    PostcodeToAddressModule,
    GridSearchTextBoxModule,
    PdfPreviewPopupModule,
  ]
})
export class BulkPaymentViewModule { }
