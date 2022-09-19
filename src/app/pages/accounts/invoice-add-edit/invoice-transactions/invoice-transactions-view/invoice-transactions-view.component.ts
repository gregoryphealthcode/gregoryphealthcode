import { Component, Input, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { AppInfoService } from 'src/app/shared/services';
import { BillingService, GetInvoiceTransactionResponseModel } from 'src/app/shared/services/billing.service';
import { DocumentsStoreService } from 'src/app/shared/services/documents-store.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-invoice-transactions-view',
  templateUrl: './invoice-transactions-view.component.html',
  styleUrls: ['./invoice-transactions-view.component.scss']
})
export class InvoiceTransactionsViewComponent implements OnInit {
  public currencySymbol: string;

  @Input() public transactions: GetInvoiceTransactionResponseModel[];

  constructor(
    private appInfo: AppInfoService,
    private billingService: BillingService,
    private documentsService: DocumentsStoreService,
    private spinner: SpinnerService
  ) { }

  ngOnInit() {
    this.currencySymbol = this.appInfo.getCurrencySymbol;
  }

  createReceipt(transactionId) {
    this.spinner.start();
    this.billingService.createTransactionReceipt(transactionId).pipe(switchMap(x => {
      this.spinner.stop();
      if (x.data.correspondenceId) {
        return this.documentsService.openPdfInPopup({ correspondenceId: x.data.correspondenceId });
      }
    })).subscribe();
  }
}
