import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { InvoiceAddEditStoreService } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit-store.service';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { BillingService } from 'src/app/shared/services/billing.service';
import { InvoiceServicesStoreService } from '../invoice-services-store.service';
import { IGetInvoiceServiceResponseModel } from '../invoice-services.service';

@Component({
  selector: 'app-invoice-services-view',
  templateUrl: './invoice-services-view.component.html',
  styleUrls: ['./invoice-services-view.component.scss']
})
export class InvoiceServicesViewComponent extends SubscriptionBase implements OnInit {
  constructor(
    private appInfo: AppInfoService,
    private store: InvoiceServicesStoreService,
    private invoiceStore: InvoiceAddEditStoreService,
    private billingService: BillingService
  ) {
    super()
  }

  invoiceId: string;
  currencySymbol: string;
  currencyCode: string;
  services: IGetInvoiceServiceResponseModel[];
  invoiceTotal: number;
  paid = 0;
  outstanding: number;

  ngOnInit() {
    this.currencySymbol = this.appInfo.getCurrencySymbol;
    this.currencyCode = this.appInfo.getCurrencyCode;

    this.addToSubscription(this.store.services$.pipe(tap(x => {
      this.services = x;
      this.services.sort(function (a, b) {
        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        return 0;
      })
      if (x) {
        this.invoiceTotal = this.services.reduce((a, b) => a + b.fee, 0);
        this.outstanding = this.invoiceTotal;
      }
    })));

    this.addToSubscription(
      this.invoiceStore.invoiceId$.pipe(tap(x => this.invoiceId = x),
        switchMap(
          id => this.getRecords$(id)
        ))
    );

    this.addToSubscription(
      this.invoiceStore.transactionsChanged$.pipe(switchMap(() =>
        this.getRecords$(this.invoiceId))
      )
    );
  }

  private getRecords$(invoiceId) {
    return this.billingService.getInvoiceTransactions(invoiceId).pipe(tap(x => {
      this.outstanding = this.invoiceTotal;
      this.paid = 0;
      x.forEach(transaction => {
        if (transaction.transactionType == 'Payment' || transaction.transactionType.includes("Debit"))
          this.paid += transaction.amount;
        if (transaction.transactionType == 'Refund' || transaction.transactionType.includes("Credit"))
          this.paid -= transaction.amount;
      });
      this.outstanding = this.invoiceTotal - this.paid;
    }))
  }
}