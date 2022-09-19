import { Component, OnInit, } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { InvoiceServicesStoreService } from 'src/app/shared/components/invoice-services-select/invoice-services-store.service';
import { IGetInvoiceServiceResponseModel } from 'src/app/shared/components/invoice-services-select/invoice-services.service';
import { AppInfoService } from 'src/app/shared/services';
import { BillingService, GetInvoiceTransactionResponseModel } from 'src/app/shared/services/billing.service';
import { InvoiceAddEditStoreService } from '../invoice-add-edit-store.service';

@Component({
  selector: 'app-invoice-transactions',
  templateUrl: './invoice-transactions.component.html',
  styleUrls: ['./invoice-transactions.component.scss']
})
export class InvoiceTransactionsComponent extends SubscriptionBase implements OnInit {
  public showAdd: boolean;
  public invoiceId: string;
  public transactions: GetInvoiceTransactionResponseModel[];
  currencySymbol: string;
  currencyCode: string;
  invoiceTotal: number;
  paid = 0;
  outstanding: number;
  services: IGetInvoiceServiceResponseModel[];

  constructor(
    private billingService: BillingService,
    public store: InvoiceAddEditStoreService,
    private appInfo: AppInfoService,
    private serviceStore: InvoiceServicesStoreService,
  ) {
    super()
  }

  ngOnInit() {
    this.currencySymbol = this.appInfo.getCurrencySymbol;
    this.currencyCode = this.appInfo.getCurrencyCode;

    this.addToSubscription(this.serviceStore.services$.pipe(tap(x => {
      this.services = x;
      if (x) {
        this.invoiceTotal = this.services.reduce((a, b) => a + b.fee, 0);
        this.outstanding = this.invoiceTotal;
      }
    })));

    this.addToSubscription(
      this.store.invoiceId$.pipe(
        tap(x => this.invoiceId = x),
        switchMap(
          id => this.getRecords$(id)
        )))

    this.addToSubscription(
      this.store.transactionsChanged$.pipe(
        switchMap(() => this.getRecords$(this.invoiceId))
      )
    )
  }

  private getRecords$(invoiceId) {
    return this.billingService.getInvoiceTransactions(invoiceId).pipe(
      tap(
        x => {
          this.transactions = x;
          this.outstanding = this.invoiceTotal;
          this.paid = 0;
          x.forEach(transaction => {
            if (transaction.transactionType == 'Payment' || transaction.transactionType.includes("Debit"))
              this.paid += transaction.amount;
            if (transaction.transactionType == 'Refund' || transaction.transactionType.includes("Credit"))
              this.paid -= transaction.amount;
          });

          this.outstanding = this.invoiceTotal - this.paid;

          if (this.transactions.length === 0) {
            this.showAdd = true;
          }
        }
      )
    )
  }
}
