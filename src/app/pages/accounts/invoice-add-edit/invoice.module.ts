import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DxDataGridModule, DxButtonModule, DxPopupModule, DxTextBoxModule, DxCheckBoxModule, DxSelectBoxModule,
        DxDateBoxModule, DxNumberBoxModule, DxTextAreaModule, DxTreeListModule, DxAutocompleteModule,
        DxRadioGroupModule, DxGalleryModule, DxPopoverModule, DxDropDownBoxModule } from 'devextreme-angular';
import { InvoicePatientDetailsComponent } from './invoice-patient-details/invoice-patient-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PatientAddEditPopupModule } from 'src/app/shared/components/patient-add-edit-popup/patient-add-edit-popup.module';
import { InvoiceErrorSectionModule } from './invoice-error-section/invoice-error-section.module';
import { InvoiceStepSectionModule } from './invoice-step-section/invoice-step-section.module';
import { InvoiceReviewComponent } from './invoice-review-tab/invoice-review.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PatientPayorsSelectModule } from 'src/app/shared/components/patient-payors-select/patient-payors-select.module';
import { InvoicePatientDetailsViewComponent } from './invoice-patient-details/invoice-patient-details-view/invoice-patient-details-view.component';
import { InvoiceDetailsEditComponent } from './invoice-details/invoice-details-edit/invoice-details-edit.component';
import { InvoiceDetailsViewComponent } from './invoice-details/invoice-details-view/invoice-details-view.component';
import { AppFormModule } from 'src/app/shared/components/app-form/app-form.module';
import { TreatmentDetailsViewComponent } from './invoice-treatment-details/treatment-details-view/treatment-details-view.component';
import { TreatmentDetailsEditComponent } from './invoice-treatment-details/treatment-details-edit/treatment-details-edit.component';
import { AppButtonModule } from 'src/app/shared/widgets/app-button/app-button.module';
import { InvoiceComponent } from './invoice.component';
import { InvoiceHeaderComponent } from './invoice-header/invoice-header.component';
import { InvoiceServicesSelectModule } from 'src/app/shared/components/invoice-services-select/invoice-services-select.module';
import { DiagnosisViewComponent } from './invoice-diagnosis/diagnosis-view/diagnosis-view.component';
import { DiagnosisEditComponent } from './invoice-diagnosis/diagnosis-edit/diagnosis-edit.component';
import { PopUpFormModule } from 'src/app/shared/components/pop-up-form/pop-up-form.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { PdfPreviewPopupModule } from 'src/app/shared/components/pdf-preview-popup/pdf-preview-popup.module';
import { InvoiceTransactionsComponent } from './invoice-transactions/invoice-transactions.component';
import { InvoiceTransactionsAddComponent } from './invoice-transactions/invoice-transactions-add/invoice-transactions-add.component';
import { InvoiceTransactionsViewComponent } from './invoice-transactions/invoice-transactions-view/invoice-transactions-view.component';
import { AppRadioButtonModule } from 'src/app/shared/widgets/app-radio-button/app-radio-button.module';
import { InvoicePaymentNotificationsComponent } from './invoice-payment-notifications/invoice-payment-notifications.component';
import { PaymentNotificationButtonsModule } from 'src/app/shared/components/payment-notification-buttons/payment-notification-buttons.module';
import { PatientQuickSearchModule } from 'src/app/shared/components/patients/patient-quick-search/patient-quick-search.module';
import { InvoicePayorDetailsViewComponent } from './invoice-payee-details/invoice-payor-details-view.component';
import { InvoiceTasksComponent } from './invoice-tasks/invoice-tasks.component';
import { InvoiceTaskAddComponent } from './invoice-tasks/invoice-task-add/invoice-task-add.component';
import { InvoiceCancelComponent } from './invoice-cancel/invoice-cancel.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        DxDataGridModule,
        DxButtonModule,
        DxPopupModule,
        DxTextBoxModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        DxDateBoxModule,
        DxNumberBoxModule,
        DxTextAreaModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        DxTreeListModule,
        DxAutocompleteModule,
        DxRadioGroupModule,
        DxGalleryModule,
        DxPopoverModule,
        DxDropDownBoxModule,
        DirectivesModule,
        PatientAddEditPopupModule,
        InvoiceStepSectionModule,
        InvoiceErrorSectionModule,
        MatTabsModule,
        PatientPayorsSelectModule,
        AppFormModule, AppButtonModule,
        InvoiceServicesSelectModule,
        PopUpFormModule,
        PipesModule,
        PdfPreviewPopupModule,
        AppRadioButtonModule,
        PaymentNotificationButtonsModule,
        PatientQuickSearchModule,
        AppFormModule,
    ],
    declarations: [
      InvoicePatientDetailsComponent,
      InvoiceReviewComponent,
      InvoicePatientDetailsViewComponent,
      InvoiceDetailsEditComponent,
      InvoiceDetailsViewComponent,
      TreatmentDetailsViewComponent,
      TreatmentDetailsEditComponent,
      InvoiceComponent,
      InvoiceHeaderComponent,
      DiagnosisViewComponent,
      DiagnosisEditComponent,
      InvoiceTransactionsComponent,
      InvoiceTransactionsAddComponent,
      InvoiceTransactionsViewComponent,
      InvoicePaymentNotificationsComponent,
      InvoicePayorDetailsViewComponent,
      InvoiceTasksComponent,
      InvoiceTaskAddComponent,
      InvoiceCancelComponent
    ],
    exports: [
      InvoiceComponent
    ]})

    export class InvoiceModule {}
