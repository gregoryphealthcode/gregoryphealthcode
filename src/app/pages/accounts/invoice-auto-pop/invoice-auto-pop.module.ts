import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceAutoPopComponent } from './invoice-auto-pop.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DxDataGridModule, DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule, DxFormModule, DxSwitchModule, DxToolbarModule, DxPopupModule, DxSelectBoxModule, DxDateBoxModule, DxProgressBarModule, DxResizableModule, DxTextBoxModule } from 'devextreme-angular';
import { MomentModule } from 'ngx-moment';
import { InvoiceSummaryViewModule } from 'src/app/shared/components/invoice-summary-view/invoice-summary-view.module';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { PatientDetailsQuickViewModule } from 'src/app/shared/components/patient-details-quick-view/patient-details-quick-view.module';
import { PaymentTrackingViewModule } from 'src/app/shared/components/payment-tracking-view/payment-tracking-view.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { GridSearchTextBoxModule } from 'src/app/shared/widgets/grid-search-text-box/grid-search-text-box.module';
import { TasksModule } from '../../tasks/tasks.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PatientAddEditPopupModule } from 'src/app/shared/components/patient-add-edit-popup/patient-add-edit-popup.module';
import { InvoiceAutoPopSearchComponent } from './invoice-auto-pop-search/invoice-auto-pop-search.component';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { ViewDiaryModule } from 'src/app/shared/components/diary/view-diary.module';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';

@NgModule({
  declarations: [InvoiceAutoPopComponent, InvoiceAutoPopSearchComponent],
  imports: [
    CommonModule,
    DxDataGridModule,
    DxBoxModule,
    DxButtonModule,
    DxContextMenuModule,
    DxCheckBoxModule,
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
    DxDateBoxModule,
    DxProgressBarModule,
    DxResizableModule,
    MatTooltipModule,
    MatCheckboxModule,
    PatientAddEditPopupModule,
    PopUpFormModule,
    FormsModule,
    ReactiveFormsModule,
    DxTextBoxModule,
    PatientSearchModule,
    ViewDiaryModule,
    DxTextBoxModule,
    AppFormModule,
  ],
  exports: [InvoiceAutoPopComponent, InvoiceAutoPopSearchComponent],
})
export class InvoiceAutoPopModule { }
