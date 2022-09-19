import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { DocumentsStoreService } from 'src/app/shared/services/documents-store.service';
import { InvoiceAddEditStoreService } from '../invoice-add-edit-store.service';
import { GetInvoiceDetailsResponse } from '../invoice-add-edit.service';
import { GetInvoicePaymentNotificationsResponseModel, InvoicePaymentNotificationsService } from './invoice-payment-notifications.service';

@Component({
  selector: 'app-invoice-payment-notifications',
  templateUrl: './invoice-payment-notifications.component.html',
  styleUrls: ['./invoice-payment-notifications.component.scss']
})
export class InvoicePaymentNotificationsComponent extends SubscriptionBase implements OnInit {
  private invoiceId: string;

  public currencySymbol: string;
  public currencyCode: string;
  public notifications: GetInvoicePaymentNotificationsResponseModel[];
  public patientId: string;
  public paymentNotificationToReallocate: any;
  public paymentNotificationToRecordAgainst: any;
  public invoiceDetails: GetInvoiceDetailsResponse;

  constructor(
    private dataService: InvoicePaymentNotificationsService,
    public store: InvoiceAddEditStoreService,
    private appInfo: AppInfoService,
    private documentsService: DocumentsStoreService,
  ) {
    super()
  }

  ngOnInit() {
    this.currencySymbol = this.appInfo.getCurrencySymbol;
    this.currencyCode = this.appInfo.getCurrencyCode;

    this.addToSubscription(
      this.store.invoiceId$.pipe(
        tap(x => this.invoiceId = x),
        switchMap(
          id => this.getRecords$(id)
        )
      )
    )

    this.addToSubscription(
      this.store.patientId$.pipe(
        tap(x => this.patientId = x)
      )
    )

    this.addToSubscription(
      this.store.needsReallocation$.pipe(
        switchMap(x => this.transactionReallocation(x)
        )
      )
    )

    this.addToSubscription(
      this.store.transactionsChanged$.pipe(
        switchMap(() => this.getRecords$(this.invoiceId))
      )
    )

    this.addToSubscription(
      this.store.invoiceMainDetails$.pipe(tap(x => this.invoiceDetails = x))
    )
  }

  public refreshData() {
    this.store.transactionsUpdated();
  }

  private getRecords$(invoiceId) {
    return this.dataService.getAll(invoiceId).pipe(
      tap(
        x => {
          x.forEach(
            el => el.leftAmount = el.initialAmount - el.paidAmount - el.reallocatedAmount
          );
          this.notifications = x;
        }
      )
    )
  }

  async transactionReallocation(paymentNotification: GetInvoicePaymentNotificationsResponseModel)
  {
    this.reallocatePaymentNotification(paymentNotification);
  }

  reallocatePaymentNotification(paymentNotification: GetInvoicePaymentNotificationsResponseModel) {
    
    if (paymentNotification)
      this.paymentNotificationToReallocate = { id: paymentNotification.id, maxAmount: paymentNotification.leftAmount, invoiceNo: this.invoiceDetails.invoiceNo, payorId: paymentNotification.payorId };
  }

  recordPayment(paymentNotification: GetInvoicePaymentNotificationsResponseModel) {
    this.paymentNotificationToRecordAgainst = { id: paymentNotification.id, maxAmount: paymentNotification.leftAmount };
  }

  savedHandler(e) {
    this.documentsService.openPdfInPopup({ correspondenceId: e.data.correspondenceId }).subscribe();

    this.refreshData();
  }
}