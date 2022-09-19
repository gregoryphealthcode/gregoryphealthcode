import { Component, OnInit } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { AppInfoService } from 'src/app/shared/services';
import { InvoiceAddEditStoreService } from '../../invoice-add-edit-store.service';
import { InvoiceDetailsRequestResponseBase } from '../../invoice-add-edit.service';

@Component({
  selector: 'app-invoice-details-view',
  templateUrl: './invoice-details-view.component.html',
  styleUrls: ['./invoice-details-view.component.scss']
})
export class InvoiceDetailsViewComponent extends SubscriptionBase implements OnInit {

  public invoiceDetails: InvoiceDetailsRequestResponseBase;

  constructor(
    private store: InvoiceAddEditStoreService,
    public appInfo: AppInfoService
  ) {
    super()
  }


  ngOnInit() {
    this.subscription.add(
      this.store.invoiceMainDetails$.subscribe(
        x => { this.invoiceDetails = x }
      )
    )
  }
}