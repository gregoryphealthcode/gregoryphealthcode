import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { data } from 'jquery';
import { map, tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { GetBulkPaymentShortFallsViewModel } from 'src/app/shared/services/billing.service';
import { DocumentsStoreService } from 'src/app/shared/services/documents-store.service';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { TemplateViewModel, TemplateService } from 'src/app/shared/services/template.service';
import { environment } from 'src/environments/environment';
import { InvoicePaymentNotificationsService, PaymentNotificationModel, RecordPaymentForPaymentNotificationRequest, ShortfallProcessModel } from '../../invoice-add-edit/invoice-payment-notifications/invoice-payment-notifications.service';
import { BulkPaymentViewStore } from '../account-bulk-payment-store.service';

@Component({
  selector: 'app-bulk-payment-shortfalls',
  templateUrl: './bulk-payment-shortfalls.component.html',
  styleUrls: ['./bulk-payment-shortfalls.component.scss'],
  providers: [DocumentsStoreService],
})
export class BulkPaymentShortfallsComponent extends SubscriptionBase implements OnInit {
  @ViewChild('dataGrid') dataGrid: DxDataGridComponent;

  shortfalls: GetBulkPaymentShortFallsViewModel[];
  selectedRecord: any;
  show = false;
  invoiceId;
  patientId;
  bulkPaymentTransactionId;
  address;
  balanceDue;
  searchBoxValue = "";
  checkBoxesMode = "always";
  selectedRows: string[] = [];
  templates: TemplateViewModel[] = [];
  checkDetails = false;
  focusedRow = 0;
  templatePreviewUrl: string = "";

  constructor(
    public store: BulkPaymentViewStore,
    private templateService: TemplateService,
    private invoicePaymentService: InvoicePaymentNotificationsService,
    private appMessages: AppMessagesService,
    private spinner: SpinnerService,
    private documentsService: DocumentsStoreService,
  ) {
    super();
  }

  ngOnInit() {
    this.spinner.start();
    this.getTemplates();

    this.addToSubscription(
      this.store.shortfalls$.pipe(tap(x => {
        this.spinner.stop();
        if (x) {
          this.selectedRows = [];
          this.shortfalls = x;
          this.shortfalls.forEach(shortfall => {
            if (!shortfall.completed)
              this.selectedRows.push(shortfall.invoiceId);
          })
        }
      }
      )))
  }

  getTemplates() {
    this.templateService.getSiteTemplates(14).subscribe(data => {
      this.templates = data;
    })
  }

  getSelectedRows() {
    this.shortfalls.forEach(shortfall => {
      if (shortfall.completed)
        this.selectedRows = this.selectedRows.filter(x => x != shortfall.invoiceId);

      this.selectedRows = this.selectedRows.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      })
    })
  }

  onFocusedRowChanged(e) {
    this.invoiceId = e.row.data.invoiceId;
    this.bulkPaymentTransactionId = e.row.data.bulkPaymentTransactionId;
    if (!e.row.data.completed) {
      this.selectedRows.push(this.invoiceId);
      this.getSelectedRows();
    }
  }

  onSelectionChanged(e) {
    this.selectedRows = e.selectedRowKeys;
    this.getSelectedRows();
  }

  public doSearch() {
    this.dataGrid.instance.searchByText(this.searchBoxValue);
  }

  reallocate(e) {
    this.show = true;
    this.invoiceId = e.data.invoiceId;
    this.patientId = e.data.patientId;
    this.address = e.data.address;
    this.balanceDue = e.data.balanceDue;
  }

  saved(e) {
    this.show = false;
    this.checkDetails = false;
      this.documentsService.openPdfInPopup({ correspondenceId: e.correspondenceId }).subscribe();
    this.store.refreshData$();    
  }

  showCheckDetails(e) {
    this.show = true;
    this.checkDetails = true;
    this.patientId = e.data.patientId;
    this.address = e.data.address;
  }

  processShortfalls() {
    this.spinner.start();

    if (this.templates.length == 0) {
      this.spinner.stop();
      this.appMessages.showSwallError("No shortfall template has been selected for one or more rows.");
      return;
    }

    let data = this.dataGrid.instance.getSelectedRowsData();

    let shortfalls: PaymentNotificationModel[] = [];

    data.forEach(x => {
      let model = new PaymentNotificationModel();
      model.invoiceId = x.invoiceId;
      model.payorId = x.patientId;
      model.payorTypeId = 2;
      model.originalPayorType = this.store.payorType;
      model.amount = x.balanceDue;
      model.bulkPaymentTransactionId = x.bulkPaymentTransactionId;
      model.sendViaPatientzone = x.sendViaPatientzone;
      model.templateId = x.templateId

      if (!x.templateId || x.templateId == undefined || x.templateId == null || x.templateId == '00000000-0000-0000-0000-000000000000') {
        this.spinner.stop();
        this.appMessages.showSwallError("No shortfall template has been selected for one or more rows.");
        return;
      }

      shortfalls.push(model);
    });

    let model = new ShortfallProcessModel();
    model.shortfalls = shortfalls;

    this.invoicePaymentService.processShortfalls(model).subscribe(data => {
      this.spinner.stop();
      this.appMessages.showSuccessSnackBar("Shortfalls processed. Paper versions sent to print queue.");
      this.store.refreshData$();
      this.selectedRows = [];
    });
  }

  templateChanged(e: any, data: any): void {
    this.dataGrid.instance.cellValue(data.rowIndex, data.column.dataField, e.value);
    this.dataGrid.instance.saveEditData();
  }

  getTemplateName(selectedTemplateId: string) {
    return this.templates.find(x => x.templateId == selectedTemplateId)?.description;
  }
}