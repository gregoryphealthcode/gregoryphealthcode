import { Component, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { AppInfoService } from 'src/app/shared/services';
import { PrintingService } from 'src/app/shared/services/printing.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { PrintQueueListViewModel } from 'src/app/shared/models/PrintQueueViewModel';
import { HttpResponse } from '@angular/common/http';
import { GridBase } from 'src/app/shared/base/grid.base';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documents-review',
  templateUrl: './documents-review.component.html',
  host: { class: 'd-flex flex-column flex-grow-1' },
  styleUrls: ['./documents-review.component.scss'],
})

@AutoUnsubscribe
export class DocumentReviewComponent extends GridBase implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  queue: PrintQueueListViewModel[] = [];
  checkBoxesMode = 'always';
  allMode = 'page';
  fromDate;
  toDate;
  dateFormat;

  constructor(
    public appInfo: AppInfoService,
    private printingService: PrintingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dateFormat = this.appInfo.getDateFormat;
    this.getPrintQueue(0);
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
    const requestModel: PrintQueueListViewModel[] = [];

    if (isAll) {
      this.queue.forEach((val) => {
        //  const model = this.MapPrintQueueViewModel(val);
        requestModel.push(val);
      });
    }
    else {
      let count = 0;
      this.dataGrid.instance.getSelectedRowsData().forEach((val) => {
        count += 1;

        requestModel.push(val);
      });
    }
    if (requestModel.length > 0) { 
      if (requestModel.length === 1) {
        this.subscription.add(this.printingService.getFileToPrint(requestModel[0].documentId, 'HC0003')
          .subscribe((response: HttpResponse<Blob>) => {
            const blob = new Blob([response.body], { type: response.body.type });
            const blobUrl = URL.createObjectURL(blob);

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();

          }));
      }
    }
  }

  dateChanged() {
    this.refreshData();
  }
}