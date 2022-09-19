import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { BillingService, GetInvoiceTransactionResponseModel, TransactionLineViewModel } from 'src/app/shared/services/billing.service';
import { AppInfoService } from 'src/app/shared/services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-patient-accounts-transactions',
  templateUrl: './patient-accounts-transactions.component.html'
})
@AutoUnsubscribe
export class PatientAccountsTransactionsComponent extends SubscriptionBase implements OnInit, OnChanges {
  @Input()
  get invoiceId(): string {
    return this._invoiceId;
  }
  set invoiceId(value: string) {
    this._invoiceId = value;
  }

  private _invoiceId: string;

  detailDataSource: GetInvoiceTransactionResponseModel[] = [];

  constructor(
    private billingService: BillingService,
    private changeDetectorRef: ChangeDetectorRef,
    public appInfo: AppInfoService,
  ) {
    super();
  }


  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (this.invoiceId !== undefined && this.invoiceId !== null) {
      this.getTransactions();
    }
  }

  ngOnInit(): void {

  }

  getTransactions() {
    this.subscription.add(this.billingService.getTransactions(this.invoiceId).subscribe(data => {
      this.detailDataSource = data;
      this.changeDetectorRef.detectChanges();
    }));
  }
}
