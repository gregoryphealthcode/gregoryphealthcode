import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { PaymentAllocationViewModel } from 'src/app/shared/services/billing.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { BulkPaymentViewStore } from '../account-bulk-payment-store.service';

@Component({
  selector: 'app-bulk-payment-allocations',
  templateUrl: './bulk-payment-allocations.component.html',
  styleUrls: ['./bulk-payment-allocations.component.scss']
})
export class BulkPaymentAllocationsComponent extends SubscriptionBase implements OnInit {
  @ViewChild('dataGrid') dataGrid: DxDataGridComponent;

  allocations: PaymentAllocationViewModel[] = [];
  searchBoxValue = "";
  bulkPaymentTransactionId: string;
  selectedRows: string[] = [];
  checkBoxesMode = "always";

  constructor(
    public store: BulkPaymentViewStore,
    public appMessages: AppMessagesService,
    private spinner: SpinnerService,
    public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.spinner.start();

    this.addToSubscription(
      this.store.allocations$.pipe(tap(x => {
        this.selectedRows = [];
        this.spinner.stop();
        if (x) {
          this.allocations = x;
          this.allocations.forEach(allocation => {
            if (!allocation.processed)
              this.selectedRows.push(allocation.bulkPaymentTransactionId);
          })
        }
      }))
    )
  }

  getSelectedRows() {
    this.allocations.forEach(allocation => {
      if (allocation.processed)
        this.selectedRows = this.selectedRows.filter(x => x != allocation.bulkPaymentTransactionId);

      this.selectedRows = this.selectedRows.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      })
    })
  }

  onFocusedRowChanged(e) {
    this.bulkPaymentTransactionId = e.row.data.bulkPaymentTransactionId;
    if (!e.row.data.processed) {
      this.selectedRows.push(this.bulkPaymentTransactionId);
      this.getSelectedRows();
    }
  }

  onSelectionChanged(e) {
    this.selectedRows = e.selectedRowKeys;
    this.getSelectedRows();
  }

  editAllocation(data, e) {
    let toAllocate = e.value;

    if (toAllocate > this.store.getUnallocated) {
      let difference = toAllocate - this.store.getUnallocated;

      this.appMessages.showAskForConfirmationModal("Are you sure?",
        "You are trying to allocate more than the unallocated amount. Do you want to increase the bulk payment total to match?",
        async () => {
          await this.store.adjustBulkPayment$(difference);

          e.component.option('value', toAllocate);

          this.store.updateAllocationAmount$(this.bulkPaymentTransactionId, toAllocate, "");
        },
        () => {
          toAllocate = this.store.getUnallocated;

          e.component.option('value', toAllocate);

          this.store.updateAllocationAmount$(this.bulkPaymentTransactionId, toAllocate, "");
        }
      );

    }
    else {
      e.component.option('value', toAllocate);

      this.store.updateAllocationAmount$(this.bulkPaymentTransactionId, toAllocate, "");
    }
  }

  delete(e) {
    const text = 'Are you sure you want to delete this allocation?'

    const callback = () => {
      this.store.removeAllocation$(e.data.bulkPaymentTransactionId);
    };

    this.appMessages.showDeleteConfirmation(callback, text);
  }

  saveAllocations() {
    this.spinner.start();
    let allocations: PaymentAllocationViewModel[] = [];
    this.selectedRows.forEach(x => {
      allocations.push(this.allocations.find(y => y.bulkPaymentTransactionId == x));
    });

    let success = this.store.processAllocations$(allocations);

    if (success) {
      this.spinner.stop();
      this.appMessages.showSuccessSnackBar(this.allocations.length == 1 ? "Allocation Processed." : "Allocations Processed.");
      this.allocations = [];
      this.store.refreshData$();
      this.selectedRows = [];
    }
    this.spinner.stop();
  }
}
