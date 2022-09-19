import { Component, OnDestroy, OnInit, ViewChild, } from "@angular/core";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { AppInfoService } from "src/app/shared/services";
import { MatDialog } from "@angular/material/dialog";
import { PrintingService, PrintQueuePrintRequest, } from "src/app/shared/services/printing.service";
import { DxDataGridComponent } from "devextreme-angular";
import { PrintQueueListViewModel, } from "src/app/shared/models/PrintQueueViewModel";
import { PrintQueueDialogComponent } from "./print-queue-dialog.component";
import { DocumentsStoreService } from "src/app/shared/services/documents-store.service";
import { tap } from "rxjs/operators";
import { AppMessagesService } from "src/app/shared/services/app-messages.service";
import { SpinnerService } from "src/app/shared/services/spinner.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DialogTemplateComponent } from "src/app/shared/components/dialog/dialog-template.component";
import { environment } from "src/environments/environment";
import { GridBase } from "src/app/shared/base/grid.base";
import { Subscription } from "rxjs/internal/Subscription";
import { Observable } from "rxjs/internal/Observable";
import { UserStore } from "src/app/shared/stores/user.store";

@Component({
  selector: "app-print-queue",
  templateUrl: "./print-queue.component.html",
  host: { class: "d-flex flex-column flex-grow-1" },
  styleUrls: ["./print-queue.component.scss"],
  providers: [DocumentsStoreService]
})
@AutoUnsubscribe
export class PrintQueueComponent extends GridBase implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  queue: PrintQueueListViewModel[] = [];
  checkBoxesMode = "always";
  allMode = "page";
  isPrintAll: boolean;
  printQueue;
  searchBoxValue: string;
  fromDate;
  toDate;
  dateFormat;

  constructor(
    public appInfo: AppInfoService,
    private dialog: MatDialog,
    private printingService: PrintingService,
    private documentsStoreService: DocumentsStoreService,
    private appMessages: AppMessagesService,
    private spinner: SpinnerService,
    private snackBar: MatSnackBar,
    public userStore: UserStore,

  ) {
    super();
  }

  ngOnInit(): void {
    this.dateFormat = this.appInfo.getDateFormat;
    this.getPrintQueue(1);

    this.addToSubscription(this.documentsStoreService.printQueue$.pipe(tap(x => {
      if (x == false)
        this.appMessages.showAskForConfirmationModal("Printed", this.printQueue.ids.length == 1 ? "Did this print correctly?" : "Did these print correctly?", () =>
          this.subscription.add(
            this.printingService.updatePrintQueue(this.printQueue).subscribe(() => {
              this.getPrintQueue(1);
              this.printQueue = null;
            })
          ))
    })))
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

  openDialog(isAll: boolean): void {
    this.isPrintAll = isAll;
    const dialogRef = this.dialog.open(PrintQueueDialogComponent, {
      width: "450px",
      data: { isAll: isAll },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  print(isAll: boolean) {
    const request: PrintQueuePrintRequest = {
      ids: [],
    };

    if (isAll) {
      this.dataGrid.instance.selectAll();
      setTimeout(() => {
        this.dataGrid.instance.getSelectedRowsData().forEach((val) => {
          request.ids.push(val.printQueueId);
        });
        this.addToPrintQueue(request)
      }, 2000);

    } else {
      this.dataGrid.instance.getSelectedRowsData().forEach((val) => {
        request.ids.push(val.printQueueId);
      });
      this.addToPrintQueue(request)
    }
  }

  addToPrintQueue(request: PrintQueuePrintRequest) {
    if (request.ids.length < 1) {
      return;
    }
    this.printQueue = request;
    this.documentsStoreService.setPrintQueue(true);
    this.documentsStoreService.openPrintQueuePdfsInPopup(request.ids).subscribe();
  }

  doSearch() {
    this.dataGrid.instance.searchByText(this.searchBoxValue);
  }

  deleteClicked(printQueueId): void {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: { title: 'Are you sure?', message: 'Are you sure you want to delete the selected document?' },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.spinner.start();
      if (result === true) {
        this.subscription.add(this.printingService.deletePrintQueue(printQueueId).subscribe((data) => {
          if (data.success) {
            this.snackBar.open("Document deleted", "Close", {
              panelClass: "badge-success",
              duration: 3000,
            });
            this.spinner.stop();
            this.refreshPrintQueue();
          }
          else {
            this.snackBar.open("Error deleting document", "Close", {
              panelClass: "badge-success",
              duration: 3000,
            });
          }
        }));
      }
      this.spinner.stop();
    });
  }

  refreshPrintQueue() {
    this.getPrintQueue(1);
  }

  dateChanged() {
    this.refreshData();
  }

  protected subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected addToSubscription(obs: Observable<any>) {
    this.subscription.add(
      obs.subscribe()
    )
  }
}