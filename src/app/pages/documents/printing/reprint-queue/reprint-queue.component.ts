import { Component, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { PrintingService } from 'src/app/shared/services/printing.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { DocumentsStoreService } from 'src/app/shared/services/documents-store.service';
import { PrintQueueListViewModel } from 'src/app/shared/models/PrintQueueViewModel';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { InvoiceAddEditService } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-reprint-queue',
  templateUrl: './reprint-queue.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./reprint-queue.component.scss'],
  providers: [DocumentsStoreService]
})

@AutoUnsubscribe
export class ReprintQueueComponent extends GridBase implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  queue: PrintQueueListViewModel[] = [];
  checkBoxesMode = 'always';
  allMode = 'page';
  fromDate;
  toDate;
  dateFormat;

  constructor(
    public appInfo: AppInfoService,
    private printingService: PrintingService,
    private documentsStoreService: DocumentsStoreService,
    private appMessages: AppMessagesService,
    private invoiceService: InvoiceAddEditService,
    public userStore: UserStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.dateFormat = this.appInfo.getDateFormat;
    this.getPrintQueue(2);
  }

  getPrintQueue(status: number) {
    this.controllerUrl = `${environment.baseurl}/printing/`;
    this.setupDataSource({
      key: 'printQueueId',
      loadParamsCallback: () => [
        { name: 'status', value: status },
        { name: 'fromDate', value: this.fromDate ? new Date(this.fromDate.getTime() - (this.fromDate.getTimezoneOffset() * 60000)).toISOString() : undefined },
        { name: 'toDate', value: this.toDate ? new Date(this.toDate.getTime() - (this.toDate.getTimezoneOffset() * 60000)).toISOString() : undefined }
      ],
    });
  }

  print(isAll: boolean) {
    let ids = []

    if (isAll) {
      this.dataGrid.instance.selectAll();
      setTimeout(() => {
        this.dataGrid.instance.getSelectedRowsData().forEach((val) => {
          ids.push(val.printQueueId);
        });
        this.addToPrintQueue(ids)
      }, 2000);

    } else {
      this.dataGrid.instance.getSelectedRowsData().forEach((val) => {
        ids.push(val.printQueueId);
      });
      this.addToPrintQueue(ids)
    }
  }

  addToPrintQueue(ids: any[]) {
    if (ids.length < 1) {
      return;
    }

    this.subscription.add(
      this.documentsStoreService.openPrintQueuePdfsInPopup(ids)
        .subscribe(() => {
          this.getPrintQueue(2)
        })
    );
  }

  dateChanged() {
    this.refreshData();
  }

  getIsInvoice(e) {
    return e.data.documentType.toLowerCase() == 'patient invoice';
  }

  regenerateInv(e) {
    this.appMessages.showAskForConfirmationModal("Are you sure?", "Are you sure you want to regenerate this Invoice?", () => {
      this.regenerateInvoice(e);
    });
  }

  regenerateDoc(e) {
    this.appMessages.showAskForConfirmationModal("Are you sure?", "Are you sure you want to regenerate this document?", () => {
      this.regenerateDocument(e);
    });
  }

  regenerateDocument(e) {
    this.printingService.regenerateDocument(e.data.documentId).subscribe(x => {
      if (x.success) {
        this.appMessages.showSuccessSnackBar("Document regenerated successfully");
        this.getPrintQueue(2);
      }
      else
        this.appMessages.showFailedSnackBar("Document couldn't be regenerated");
    },
      e => {
        this.appMessages.showApiErrorNotification(e);
      }
    )
  }

  regenerateInvoice(e) {
    this.invoiceService.regenerateInvoice(e.data.invoiceId).subscribe(x => {
      if (x.success) {
        this.appMessages.showSuccessSnackBar("Invoice regenerated successfully");
        this.getPrintQueue(2);
      }
      else
        this.appMessages.showFailedSnackBar("Invoice couldn't be regenerated");
    },
      e => {
        this.appMessages.showApiErrorNotification(e);
      }
    )
  }
}