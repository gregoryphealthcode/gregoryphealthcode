import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { BillingService, InvoiceLineItemViewModel } from 'src/app/shared/services/billing.service';
import { AppInfoService } from 'src/app/shared/services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-patient-accounts-invoice-items',
  templateUrl: './patient-accounts-invoice-items.component.html'
})

@AutoUnsubscribe
export class PatientAccountsInvoiceItemsComponent extends SubscriptionBase implements OnInit, OnChanges {
  @Input()
  get invoiceId(): string {
    return this._invoiceId;
  }
  set invoiceId(value: string) {
    this._invoiceId = value;
  }

  private _invoiceId: string;

  detailDataSource: InvoiceLineItemViewModel[] = [];

  constructor(
    private billingService: BillingService,
    private changeDetectorRef: ChangeDetectorRef,
    public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (this.invoiceId !== undefined && this.invoiceId !== null) {
      this.getItems();
    }
  }

  ngOnInit(): void {

  }

  getItems() {
    this.subscription.add(this.billingService.getInvoiceItems(this.invoiceId).subscribe(data => {
      this.detailDataSource = data;
      this.changeDetectorRef.detectChanges();
    }));
  }
}