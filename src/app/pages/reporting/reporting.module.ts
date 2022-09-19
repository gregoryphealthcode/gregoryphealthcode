import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxBoxModule, DxButtonModule, DxContextMenuModule, DxCheckBoxModule, DxFormModule, DxDropDownBoxModule, DxFileUploaderModule, DxDataGridModule,
  DxPopupModule, DxDateBoxModule,  DxTextAreaModule, DxListModule,  DxTextBoxModule,  DxResponsiveBoxModule,  DxSelectBoxModule,
  DxRangeSelectorModule,  DxResizableModule,  DxScrollViewModule,  DxGalleryModule,  DxLoadPanelModule,  DxChartModule,
  DxPieChartModule,  DxProgressBarModule,  DxToolbarModule,  DxPivotGridModule,  DxSwitchModule,  DxDropDownButtonModule} from 'devextreme-angular';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ReportingRoutingModule } from './reporting-routing.module';
import { MomentModule } from 'ngx-moment';
import { ReportWaitingListComponent } from './diary/waiting-list-reports/report-waiting-list/report-waiting-list.component';
import { ReportDiaryAppointmentsComponent } from './diary/appointments-reports/report-diary-appointments/report-diary-appointments.component';
import { ReportTransactionsGridComponent } from './financial/transactions-reports/report-transactions-grid/report-transactions.component';
import { ReportInvoicesUnpaidComponent } from './financial/invoices-reports/report-invoices-unpaid/report-invoices-unpaid.component';
import { PatientSearchModule } from 'src/app/shared/components/patient-search/patient-search.component';
import { DxReportViewerModule } from 'devexpress-reporting-angular';
import { ReportsCentreComponent } from './reports-centre/reports-centre.component';
import { RouterModule } from '@angular/router';
import { InvoicesReportsComponent } from './financial/invoices-reports/invoices-reports.component';
import { TransactionsReportsComponent } from './financial/transactions-reports/transactions-reports.component';
import { AppointmentsReportsComponent } from './diary/appointments-reports/appointments-reports.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { GraphTransactionsModule } from './financial/transactions-reports/graph-transactions/graph-transactions.component';
import { AnalysisTransactionsModule } from './financial/transactions-reports/analysis-transactions/analysis-transactions.component';
import { ReportCardComponent } from './shared/report-card/report-card.component';
import { ReportsTypeWrapperComponent } from './shared/reports-type-wrapper/reports-type-wrapper.component';
import { ReportsBackButtonComponent } from './shared/reports-back-button/reports-back-button.component';
import { ReportsWrapperComponent } from './shared/reports-wrapper/reports-wrapper.component';
import { ReportChargesComponent } from './financial/report-charges/report-charges.component';
import { ReportTransactionsGridNewComponent } from './financial/transactions-reports/report-transactions-grid-new/report-transactions-grid-new.component';
import { ReportInvoicesGridNewComponent } from './financial/invoices-reports/report-invoices-grid-new/report-invoices-grid-new.component';
import { ReportChargesGridNewComponent } from './financial/report-charges/report-charges-grid-new/report-charges-grid-new.component';
import { PatientReferrersGridNewComponent } from './patient/patient-referrers-grid-new/patient-referrers-grid-new.component';
import { WaitingListReportsComponent } from './diary/waiting-list-reports/waiting-list-reports.component';
import { PatientReferrersReportsComponent } from './patient/patient-referrers-reports.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MedSecSiteSelectorModule } from 'src/app/shared/components/med-sec-site-selector/med-sec-site-selector.module';


@NgModule({
  declarations: [
    ReportInvoicesUnpaidComponent,
    ReportTransactionsGridComponent,
    ReportWaitingListComponent,
    ReportDiaryAppointmentsComponent,
    ReportsCentreComponent,
    InvoicesReportsComponent,
    TransactionsReportsComponent,
    AppointmentsReportsComponent,
    ReportCardComponent,
    ReportsTypeWrapperComponent,
    ReportsBackButtonComponent,
    ReportsWrapperComponent,
    PatientReferrersReportsComponent,
    ReportChargesComponent,
    ReportTransactionsGridNewComponent,
    ReportInvoicesGridNewComponent,
    ReportChargesGridNewComponent,
    PatientReferrersGridNewComponent,
    WaitingListReportsComponent,
  ],
  imports: [
    DxBoxModule,
    DxButtonModule,
    DxContextMenuModule,
    DxCheckBoxModule,
    CommonModule,
    RouterModule,
    DxFormModule,
    DxDropDownBoxModule,
    DxFileUploaderModule,
    DxButtonModule,
    DxDataGridModule,
    DxPopupModule,
    DxDateBoxModule,
    DxTextAreaModule,
    DxListModule,
    DxTextBoxModule,
    DxResponsiveBoxModule,
    DxSelectBoxModule,
    DxRangeSelectorModule,
    DxResizableModule,
    DxScrollViewModule,
    PipesModule,
    MomentModule,
    DxGalleryModule,
    DxLoadPanelModule,
    DxChartModule,
    DxPieChartModule,
    PatientSearchModule,
    DxProgressBarModule,
    DxToolbarModule,
    DxPivotGridModule,
    DxSwitchModule,
    DxDropDownButtonModule,
    DxReportViewerModule,
    MatTabsModule,
    DirectivesModule,
    GraphTransactionsModule,
    AnalysisTransactionsModule,
    MatCheckboxModule,
    MedSecSiteSelectorModule
  ],
  exports: [ReportingRoutingModule]
})
export class ReportingModule { }
