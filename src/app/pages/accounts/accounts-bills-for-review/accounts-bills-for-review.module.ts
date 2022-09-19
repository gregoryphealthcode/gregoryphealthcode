import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule, DxPopupModule, DxFormModule, DxDropDownBoxModule, DxFileUploaderModule, DxDataGridModule, DxDateBoxModule, DxTextAreaModule, DxListModule, DxTextBoxModule, DxResponsiveBoxModule, DxSelectBoxModule, DxRangeSelectorModule, DxResizableModule, DxScrollViewModule } from 'devextreme-angular';
import { InvoiceSummaryViewModule } from 'src/app/shared/components/invoice-summary-view/invoice-summary-view.module';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { PatientDetailsQuickViewModule } from 'src/app/shared/components/patient-details-quick-view/patient-details-quick-view.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AccountsBillsForReviewComponent } from './accounts-bills-for-review.component';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';

@NgModule({
  imports: [
    DxBoxModule,
    DxButtonModule,
    DxContextMenuModule,
    DxCheckBoxModule,
    DxPopupModule,
    DxContextMenuModule,
    CommonModule,
    DxFormModule,
    DxDropDownBoxModule,
    DxFileUploaderModule,
    DxButtonModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxTextAreaModule,
    DxListModule,
    DxTextBoxModule,
    DxResponsiveBoxModule,
    DxSelectBoxModule,
    DxRangeSelectorModule,
    DxResizableModule,
    DxScrollViewModule,
    NoDataModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    PatientDetailsQuickViewModule,
    DirectivesModule,
    InvoiceSummaryViewModule,    
    GridSearchTextBoxModule,
    AppButtonModule
  ],
  declarations: [AccountsBillsForReviewComponent],
  exports: [AccountsBillsForReviewComponent]
})
export class AccountsBillsForReviewModule { }
