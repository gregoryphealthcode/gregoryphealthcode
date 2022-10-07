import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { BillingService, BulkPaymentAddAllocationModel, OutstandingInsurerInvoicesViewModel } from 'src/app/shared/services/billing.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import notify from 'devextreme/ui/notify';
import { sumBy } from 'src/app/shared/helpers/array-helper';
import { switchMap, tap } from 'rxjs/operators';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';

@Component({
  selector: 'app-outstanding-invoices',
  templateUrl: './outstanding-invoices.component.html',
  styleUrls: ['./outstanding-invoices.component.scss']
})
export class OutstandingInvoicesComponent extends SubscriptionBase {
  constructor(private billingService: BillingService, private spinner: SpinnerService,
    private appMessages: AppMessagesService
  ) {
    super();
  }

  @Input() dateFormat: any;
  @Input() currencyCode: string;
  @Input() siteId: string;
  @Input() bulkPaymentId: string;
  @Input() unallocated: number;
  @Input() allocated: number;
  @Input() total: number;
  @Input() payorName: string;
  @Input() methodId: any;
  @Input() isNew = false;
  @Input() isPopup = false;

  @Input() public set payorId(value) {
    if (value) {
      this._payorId = value;
      this.getRecords();
    }
  }
  public get payorId() { return this._payorId; }
  private _payorId: any;

  @Output() onAllocatedChanged = new EventEmitter<number>()

  public showUnassignedCreditPopup: boolean;
  unassignedUnallocated: number;
  unassignedComments: string;
  hasPatientZone = true;

  bulkPayments: OutstandingInsurerInvoicesViewModel[] = [];
  allocations: BulkPaymentAddAllocationModel[] = [];  

  private getRecords() {
    this.subscription.add(
      this.getRecords$().subscribe()
    )
  }

  private getRecords$() {
    this.spinner.start();
    return this.billingService.getInsurerOutstandingInvoices(this.siteId, this.payorId)
      .pipe(tap(data => {
        this.bulkPayments = data;
        this.spinner.stop();
      }))
  }

  saveAllocation() {
    this.spinner.start();
    this.subscription.add(this.billingService.saveAllocationPayment({ bulkPaymentId: this.bulkPaymentId, allocations: this.allocations })
      .pipe(
        tap(() => { this.allocations = []; notify('Allocations saved successfully.', 'success'); }
          , (error: any) => this.appMessages.showApiErrorNotification(error)),
        switchMap(() => this.getRecords$()))
      .subscribe());
  }

  addUnassigned() {
    this.unassignedUnallocated = this.unallocated;
    this.showUnassignedCreditPopup = true;
  }

  saveUnassigned() {
    this.spinner.start();
    this.unassignedAllocation();
  }

  unassignedAllocation() {
    const allocate: OutstandingInsurerInvoicesViewModel = new OutstandingInsurerInvoicesViewModel();
    allocate.allocation = this.unassignedUnallocated;
    allocate.payorId = this.payorId;
    allocate.siteId = this.siteId;
    allocate.balanceDue = 0;
    allocate.totalDue = 0;
  }

  cancel() {
    this.showUnassignedCreditPopup = false;
  }

  allocation(data, e) {
    let toAllocate = e.value;
    toAllocate = this.getMaxAvailable(toAllocate);

    if (toAllocate !== e.value) {
      e.component.option('value', toAllocate);
      return;
    }
    this.addAllocation(toAllocate, data.invoiceId)
  }

  private addAllocation(value: number, invoiceId: string) {
    let existingRecord = this.allocations.find(x => x.invoiceId == invoiceId);

    if (existingRecord) {
      existingRecord.allocated = value
    }
    else {
      let allocate: BulkPaymentAddAllocationModel = {
        allocated: value,
        invoiceId: invoiceId
      };
      this.allocations.push(allocate);
    }
    this.onAllocatedChanged.emit(sumBy(this.allocations, 'allocated'));
  }

  private getMaxAvailable(toAllocate) {
    const totalUnallocated = this.total - this.allocated;

    return toAllocate > totalUnallocated ? totalUnallocated : toAllocate;
  }

  setTextBoxValue(textBox, data) {
    let toAllocate = data.balanceDue;
    if (toAllocate < 0) {
      toAllocate = 0
    }
    textBox.instance.option('value', toAllocate);
  }
}