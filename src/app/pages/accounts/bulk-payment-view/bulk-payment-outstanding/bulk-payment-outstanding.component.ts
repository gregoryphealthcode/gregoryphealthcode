import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';
import { OutstandingInsurerInvoicesViewModel, BulkPaymentAddAllocationModel } from 'src/app/shared/services/billing.service';
import { BulkPaymentViewStore } from '../account-bulk-payment-store.service';

@Component({
  selector: 'app-bulk-payment-outstanding',
  templateUrl: './bulk-payment-outstanding.component.html',
  styleUrls: ['./bulk-payment-outstanding.component.scss']
})
export class BulkPaymentOutstandingComponent extends SubscriptionBase implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  invoices: OutstandingInsurerInvoicesViewModel[];
  allocations: BulkPaymentAddAllocationModel[] = [];
  showPopup = false;
  searchBoxValue = "";

  constructor(
    public store: BulkPaymentViewStore,
    private appMessages: AppMessagesService,
    public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.addToSubscription(
      this.store.invoices$.pipe(tap(x => { this.invoices = x }))
    )

    this.addToSubscription(
      this.store.tabIndex$.pipe(tap(x => {
        if (x != 0)
          this.allocations = [];
      }))
    )
  }

  allocation(data, e) {
    let toAllocate = e.value;

    if (toAllocate > this.store.getUnallocated) {
      let difference = toAllocate - this.store.getUnallocated;

      this.appMessages.showAskForConfirmationModal("Are you sure?",
        "You are trying to allocate more than the unallocated amount. Do you want to increase the bulk payment total to match?",
        async () => {
          await this.store.adjustBulkPayment$(difference);

          e.component.option('value', toAllocate);

          this.addAllocation(toAllocate, data.invoiceId);
        },
        () => {
          toAllocate = this.store.getUnallocated;

          e.component.option('value', toAllocate);

          this.addAllocation(toAllocate, data.invoiceId);
        }
      );

    }
    else {
      e.component.option('value', toAllocate);

      this.addAllocation(toAllocate, data.invoiceId)
    }
  }

  addAllocation(value: number, invoiceId: string) {
    let existingRecord = this.allocations.find(x => x.invoiceId == invoiceId);

    if (existingRecord) {
      existingRecord.allocation = value
    }
    else {
      let allocate: BulkPaymentAddAllocationModel = {
        allocation: value,
        invoiceId: invoiceId
      };
      this.allocations.push(allocate);
    }

    this.store.updateAllocated$(this.allocations);
  }

  setTextBoxValue(textBox, data) {
    let toAllocate = data.balanceDue;
    if (toAllocate < 0) {
      toAllocate = 0;
    }

    if (toAllocate > this.store.getUnallocated)
      toAllocate = this.store.getUnallocated;

    textBox.instance.option('value', toAllocate);
    this.addAllocation(toAllocate, data.invoiceId);
  }

  saveAllocations() {
    let success = this.store.saveAllocations$(this.allocations);

    if (success) {
      notify(this.allocation.length == 1 ? "Allocation saved." : "Allocations saved.");
      this.allocations = [];
    }
  }
}
